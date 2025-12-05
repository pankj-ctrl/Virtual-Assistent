import { useEffect } from 'react';

export const useSpeechRecognition = (
  isMobile,
  isListeningEnabled,
  userData,
  setStatus,
  setUserText,
  setAiText,
  handleCommand,
  setUserData,
  speechInitialized,
  setSpeechInitialized
) => {

  // Auto-enable sound when user data is loaded
  useEffect(() => {
    if (userData && userData.assistantName && !isListeningEnabled) {
      // Small delay to ensure speech synthesis is ready
      setTimeout(() => {
        console.log("Sound enabled for assistant:", userData.assistantName);
      }, 1000);
    }
  }, [userData, isListeningEnabled]);

  useEffect(() => {
    if (!userData || !userData.assistantName || !isListeningEnabled) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = !isMobile; // Disable continuous mode on mobile
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let isProcessing = false;
    let isListening = false;

    recognition.onresult = async (e) => {
      if (isProcessing) return;

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          const transcript = result[0].transcript.trim();

          if (
            transcript
              .toLowerCase()
              .includes(userData.assistantName.toLowerCase())
          ) {
            isProcessing = true;
            setStatus("Processing...");

            try {
              setAiText("");
              setUserText(transcript);
              console.log("🤖 Getting AI response for:", transcript);
              const data = await userData.getGrokResponse(transcript);
              console.log("🤖 AI response received:", data.response.substring(0, 50) + "...");
              setAiText(data.response);
              setUserText("");
              handleCommand(data);
              // Update history
              setUserData(prev => ({
                ...prev,
                history: [...(prev.history || []), transcript].slice(-10) // Keep last 10
              }));
            } catch (err) {
              console.error("❌ Error in speech processing:", err);
              setStatus(isMobile ? "Tap to speak" : "Listening...");
            } finally {
              isProcessing = false;
            }
          }
        }
      }
    };

    recognition.onend = () => {
      if (!isProcessing && !isListening) {
        if (!isMobile) {
          recognition.start();
          isListening = true;
        }
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech') {
        console.error("Recognition error:", e);
      }
      if (e.error !== 'no-speech' && !isProcessing && !isListening && !isMobile) {
        setTimeout(
          () => {
            recognition.start();
            isListening = true;
          },
          1000
        );
      }
    };

    if (!isMobile) {
      recognition.start();
      isListening = true;

      // Auto-restart every 5 seconds to ensure continuous listening
      const restartInterval = setInterval(() => {
        if (!isProcessing && !isListening) {
          recognition.start();
          isListening = true;
        }
      }, 5000);

      // Handle page visibility change to restart recognition if needed
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && !isProcessing && !isListening) {
          recognition.start();
          isListening = true;
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        recognition.stop();
        clearInterval(restartInterval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [userData, isListeningEnabled, isMobile]);

  const startMobileListening = () => {
    if (!isMobile || !userData || !userData.assistantName) return;

    // Ensure speech synthesis is initialized on mobile
    if (!speechInitialized && isMobile) {
      try {
        const silentUtterance = new SpeechSynthesisUtterance("");
        silentUtterance.volume = 0.01;
        window.speechSynthesis.speak(silentUtterance);
        setSpeechInitialized(true);
        console.log("Speech synthesis initialized via tap");
      } catch (error) {
        console.log("Speech initialization via tap failed:", error);
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = async (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const result = e.results[i];
          if (result.isFinal) {
            const transcript = result[0].transcript.trim();
            if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
              setStatus("Processing...");
              try {
                setAiText("");
                setUserText(transcript);
                console.log("🤖 Getting AI response for:", transcript);
                const data = await userData.getGrokResponse(transcript);
                console.log("🤖 AI response received:", data.response.substring(0, 50) + "...");
                setAiText(data.response);
                setUserText("");
                handleCommand(data);
                setUserData(prev => ({
                  ...prev,
                  history: [...(prev.history || []), transcript].slice(-10)
                }));
              } catch (err) {
                console.error("❌ Error in mobile speech processing:", err);
                setStatus("Error occurred. Tap to speak again.");
              }
            }
          }
        }
      };

      recognition.onend = () => {
        setStatus("Tap to speak");
      };

      recognition.onerror = (e) => {
        console.error("Recognition error:", e);
        setStatus("Error. Tap to try again.");
      };

      setStatus("Listening...");
      recognition.start();
    }
  };

  return { startMobileListening };
};