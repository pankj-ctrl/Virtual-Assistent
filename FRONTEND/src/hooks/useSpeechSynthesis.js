import { useState, useEffect } from 'react';

export const useSpeechSynthesis = (isMobile) => {
  const [speechInitialized, setSpeechInitialized] = useState(false);

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
              console.log("Speech synthesis initialized on mobile");
              document.removeEventListener('touchstart', handleMobileInit);
              document.removeEventListener('click', handleMobileInit);
            };

            document.addEventListener('touchstart', handleMobileInit, { once: true });
            document.addEventListener('click', handleMobileInit, { once: true });
          } else {
            // For desktop, initialize immediately
            window.speechSynthesis.speak(silentUtterance);
            setSpeechInitialized(true);
            console.log("Speech synthesis initialized");
          }
        } catch (error) {
          console.log("Speech initialization failed:", error);
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
      console.log("🎤 Attempting to speak on mobile:", text.substring(0, 50) + "...");

      utterance.onstart = () => {
        console.log("🔊 Mobile speech started successfully");
      };

      utterance.onend = () => {
        console.log("🔊 Mobile speech ended");
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.error("❌ Mobile speech error:", e);

        // Try fallback with default voice
        if (e.error !== 'not-allowed') {
          console.log("Retrying mobile speech with fallback...");
          const fallbackUtterance = new SpeechSynthesisUtterance(text);
          fallbackUtterance.lang = "en-US";
          fallbackUtterance.rate = 0.8;
          fallbackUtterance.volume = 0.8;
          fallbackUtterance.pitch = 1;

          fallbackUtterance.onstart = () => console.log("🔊 Fallback speech started");
          fallbackUtterance.onend = () => {
            console.log("🔊 Fallback speech ended");
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

      utterance.onstart = () => console.log("🔊 Speaking started");
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = (e) => console.error("❌ Speech error", e);

      window.speechSynthesis.speak(utterance);
    }
  };

  return { speechInitialized, speak };
};