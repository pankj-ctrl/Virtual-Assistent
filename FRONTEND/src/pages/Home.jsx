import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";

function Home() {
  const { userData, serverUrl, setUserData, getGrokResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("Listening...");
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isListeningEnabled, setIsListeningEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [speechInitialized, setSpeechInitialized] = useState(false);

  const cache = useRef(new Map());

  // Initialize speech synthesis on component mount
  useEffect(() => {
    if ("speechSynthesis" in window) {
      // Try to initialize speech synthesis
      const initSpeech = () => {
        try {
          // Create a silent utterance to initialize
          const silentUtterance = new SpeechSynthesisUtterance("");
          silentUtterance.volume = 0.01; // Very quiet
          window.speechSynthesis.speak(silentUtterance);
          setSpeechInitialized(true);
          console.log("Speech synthesis initialized");
        } catch (error) {
          console.log("Speech initialization failed:", error);
        }
      };

      // Initialize immediately
      initSpeech();

      // Also try on first user interaction
      const handleFirstInteraction = () => {
        if (!speechInitialized) {
          initSpeech();
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };

      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('keydown', handleFirstInteraction);

      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };
    }
  }, []);

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const speak = (text, onEnd) => {
    if (!text) {
      console.error("Nothing to speak");
      return;
    }

    if (!("speechSynthesis" in window)) {
      console.error("SpeechSynthesis not supported in this browser");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Ensure voices are loaded
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // If voices not loaded, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        selectVoice();
      };
    } else {
      selectVoice();
    }

    function selectVoice() {
      const hindiVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("hi") ||
          voice.name.toLowerCase().includes("hindi") ||
          voice.lang === "hi-IN"
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    }

    utterance.onstart = () => console.log("🔊 Speaking started");
    utterance.onend = () => {
      setAiText("");
      if (onEnd) onEnd();
    };
    utterance.onerror = (e) => console.error("❌ Speech error", e);

    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    setStatus("Answering");
    speak(response, () => setStatus("Listening..."));

    if (type === "google_search") {
      let query = userInput
        .toLowerCase()
        .replace(/search\s+on\s+google\s+for\s+/gi, "")
        .replace(/google\s+search\s+for\s+/gi, "")
        .replace(/search\s+for\s+/gi, "")
        .replace(/on\s+google\s+/gi, "")
        .replace(/search\s+google\s+/gi, "")
        .replace(userData.assistantName.toLowerCase(), "")
        .replace("search", "")
        .replace("on", "")
        .trim();

      const encoded = encodeURIComponent(query);
      window.open(`https://www.google.com/search?q=${encoded}`, "_blank");
    }
    if (type === "open_google") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com`, "_blank");
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }

    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }

    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }

    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
    if (type === "open_youtube") {
      window.open(`https://www.youtube.com/`, "_blank");
    }
    if (type === "youtube_search") {
      let query = userInput
        .toLowerCase()
        .replace("youtube", "")
        .replace("on", "")
        .replace(userData.assistantName.toLowerCase(), "")
        .replace("search", "")
        .replace("play", "")
        .trim();

      const encoded = encodeURIComponent(query);
      window.open(
        `https://www.youtube.com/results?search_query=${encoded}`,
        "_blank"
      );
    }

    if (type === "youtube_play") {
      let query = userInput
        .toLowerCase()
        .replace("youtube", "")
        .replace("on", "")
        .replace(userData.assistantName.toLowerCase(), "")
        .replace("play", "")
        .trim();

      const encoded = encodeURIComponent(query);
      window.open(
        `https://www.youtube.com/results?search_query=${encoded}`,
        "_blank"
      );
    }
  };

  // Auto-enable sound when user data is loaded
  useEffect(() => {
    if (userData && userData.assistantName && !soundEnabled) {
      setSoundEnabled(true);
      // Small delay to ensure speech synthesis is ready
      setTimeout(() => {
        const welcomeMessage = `Hello! I am ${userData.assistantName}. Voice enabled. How can I help you?`;
        speak(welcomeMessage);
      }, 1000);
    }
  }, [userData, soundEnabled]);

  useEffect(() => {
    if (!userData || !userData.assistantName || !isListeningEnabled) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
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

            const normalizedTranscript = transcript.toLowerCase().trim();
            if (cache.current.has(normalizedTranscript)) {
              const data = cache.current.get(normalizedTranscript);
              handleCommand(data);
              isProcessing = false;
            } else {
              try {
                setAiText("");
                setUserText(transcript);
                const data = await getGrokResponse(transcript);
                setAiText(data.response);
                setUserText("");
                cache.current.set(normalizedTranscript, data);
                handleCommand(data);
                // Update history
                setUserData(prev => ({
                  ...prev,
                  history: [...(prev.history || []), transcript].slice(-10) // Keep last 10
                }));
              } catch (err) {
                console.error(err);
                setStatus("Error occurred. Listening...");
              } finally {
                isProcessing = false;
              }
            }
          }
        }
      }
    };

    recognition.onend = () => {
      if (!isProcessing && !isListening) {
        recognition.start();
        isListening = true;
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech') {
        console.error("Recognition error:", e);
      }
      if (e.error !== 'no-speech' && !isProcessing && !isListening) {
        setTimeout(
          () => {
            recognition.start();
            isListening = true;
          },
          1000
        );
      }
    };

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
  }, [userData, isListeningEnabled]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] ">
      <CgMenuRight className={`text-white fixed top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer z-50 ${menuOpen ? 'hidden' : 'block'} lg:hidden`} onClick={() => setMenuOpen(true)} />

      <div className={`fixed right-0 top-0 h-full w-full sm:w-64 bg-gradient-to-t from-black to-[#02023d] bg-opacity-30 backdrop-blur-lg p-5 flex flex-col gap-5 transform transition-transform duration-300 z-40 ${menuOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}>
        <RxCross1 className=" text-white absolute top-[20px] right-[10px] w-[25px] h-[25px] cursor-pointer lg:hidden" onClick={() => setMenuOpen(false)} />
        <button
          className="w-full max-w-[200px] h-[50px] text-black font-bold bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 rounded-full text-[16px] cursor-pointer shadow-lg transform hover:scale-105 transition-all duration-200"
          onClick={handleLogout}
        >
          🚪 Log Out
        </button>
        <button
          className="min-w-[180px] h-[50px] text-black font-bold bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 rounded-full text-[16px] cursor-pointer shadow-lg transform hover:scale-105 transition-all duration-200"
          onClick={() => {
            navigate("/customize");
          }}
        >
          🎨 Customize Assistant
        </button>
        <button
          className="w-full max-w-[200px] h-[50px] text-black font-bold bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 rounded-full text-[16px] cursor-pointer shadow-lg transform hover:scale-105 transition-all duration-200"
          onClick={() => {
            const u = new SpeechSynthesisUtterance("Voice is already enabled and working!");
            window.speechSynthesis.speak(u);
          }}
        >
          🔊 Sound Active
        </button>
        <button
          className="w-full max-w-[200px] h-[50px] text-black font-bold bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 rounded-full text-[16px] cursor-pointer shadow-lg transform hover:scale-105 transition-all duration-200"
          onClick={() => setIsListeningEnabled(!isListeningEnabled)}
        >
          {isListeningEnabled ? "🔇 Disable Listening" : "🎤 Enable Listening"}
        </button>
        <div className="w-full h-[3px] bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>
        <div className="w-full h-[60%] overflow-auto flex flex-col gap-[20px] ">
            {userData?.history?.map((his, index) => (
                <span key={index} className="text-white">{his}</span>
            ))}
        </div>
      </div>

      <div className="w-[250px] h-[300px] md:w-[300px] md:h-[350px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover rounded-4xl"
        />
      </div>
      <h1 className="text-white text-[16px] md:text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>
      {!aiText && <img src={userImg} className="w-[200px]" />}
      {aiText && <img src={aiImg} className="w-[200px]" />}

      <p className="text-white text-[14px] md:text-[16px]">{isListeningEnabled ? status : "Listening Disabled"}</p>
      <h1 className="text-white">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
}

export default Home;
