import { useState, useEffect } from 'react';

export const useSpeechSynthesis = (isMobile) => {
  const [speechInitialized, setSpeechInitialized] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Initialize speech synthesis on component mount
  useEffect(() => {
    if ("speechSynthesis" in window) {
      // Try to initialize speech synthesis
      const initSpeech = () => {
        try {
          // Create a silent utterance to initialize
          const silentUtterance = new SpeechSynthesisUtterance("");
          silentUtterance.volume = 0.01; // Very quiet

          // On mobile, we need to be more careful with initialization
          if (isMobile) {
            // For mobile, wait for user interaction before initializing
            const handleMobileInit = () => {
              window.speechSynthesis.speak(silentUtterance);
              setSpeechInitialized(true);
              setUserInteracted(true);
              document.removeEventListener('touchstart', handleMobileInit);
              document.removeEventListener('click', handleMobileInit);
            };

            document.addEventListener('touchstart', handleMobileInit, { once: true });
            document.addEventListener('click', handleMobileInit, { once: true });
          } else {
            // For desktop, initialize immediately
            window.speechSynthesis.speak(silentUtterance);
            setSpeechInitialized(true);
            setUserInteracted(true);
          }
        } catch (error) {
        }
      };

      // Initialize immediately (will handle mobile differently)
      initSpeech();

      // Also try on first user interaction (backup for desktop)
      const handleFirstInteraction = () => {
        if (!speechInitialized) {
          initSpeech();
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };

      if (!isMobile) {
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);
      }

      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };
    }
  }, [isMobile, speechInitialized]);

  const speak = (text, onEnd) => {
    if (!text) {
      console.error("Nothing to speak");
      return;
    }

    if (!("speechSynthesis" in window)) {
      console.error("SpeechSynthesis not supported in this browser");
      return;
    }

    // On mobile, check if user has interacted first
    if (isMobile && !userInteracted) {
      // Wait for user interaction before speaking
      const handleInteraction = () => {
        setUserInteracted(true);
        document.removeEventListener('touchstart', handleInteraction);
        document.removeEventListener('click', handleInteraction);
        // Now speak after interaction
        speak(text, onEnd);
      };
      document.addEventListener('touchstart', handleInteraction, { once: true });
      document.addEventListener('click', handleInteraction, { once: true });
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set basic properties
    utterance.rate = isMobile ? 0.9 : 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = isMobile ? "en-US" : "hi-IN";

    // For mobile, try to speak immediately without waiting for voices
    if (isMobile) {

      utterance.onstart = () => {
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.error("❌ Mobile speech error:", e);

        // Try fallback with default voice
        if (e.error !== 'not-allowed') {
          const fallbackUtterance = new SpeechSynthesisUtterance(text);
          fallbackUtterance.lang = "en-US";
          fallbackUtterance.rate = 0.8;
          fallbackUtterance.volume = 0.8;
          fallbackUtterance.pitch = 1;

          fallbackUtterance.onstart = () => {};
          fallbackUtterance.onend = () => {
            if (onEnd) onEnd();
          };
          fallbackUtterance.onerror = (e2) => {
            console.error("❌ Fallback speech also failed:", e2);
            if (onEnd) onEnd();
          };

          try {
            window.speechSynthesis.speak(fallbackUtterance);
          } catch (error) {
            console.error("❌ Fallback speech failed to start:", error);
            if (onEnd) onEnd();
          }
        } else {
          if (onEnd) onEnd();
        }
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("❌ Failed to start mobile speech:", error);
        if (onEnd) onEnd();
      }

    } else {
      // Desktop version with voice selection
      let voices = window.speechSynthesis.getVoices();

      const selectVoice = () => {
        const hindiVoice = voices.find(
          (voice) =>
            voice.lang.startsWith("hi") ||
            voice.name.toLowerCase().includes("hindi") ||
            voice.lang === "hi-IN"
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }
      };

      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          selectVoice();
        };
      } else {
        selectVoice();
      }

      utterance.onstart = () => {};
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = (e) => console.error("❌ Speech error", e);

      window.speechSynthesis.speak(utterance);
    }
  };

  return { speechInitialized, userInteracted, speak };
};