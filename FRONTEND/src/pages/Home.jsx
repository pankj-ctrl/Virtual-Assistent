import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";

// Custom hooks
import { useMobileDetection, useSpeechSynthesis, useSpeechRecognition } from "../hooks";

// Utils
import { handleCommand } from "../utils";

function Home() {
  const { userData, serverUrl, setUserData, getGrokResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  // Mobile detection
  const isMobile = useMobileDetection();

  // State
  const [status, setStatus] = useState("Listening...");
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isListeningEnabled, setIsListeningEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const cache = useRef(new Map());

  // Speech synthesis hook
  const { speechInitialized, speak } = useSpeechSynthesis(isMobile);

  // Speech recognition hook
  const { startMobileListening } = useSpeechRecognition(
    isMobile,
    isListeningEnabled,
    userData,
    setStatus,
    setUserText,
    setAiText,
    (data) => handleCommand({ ...data, userData }, speak, setStatus, isMobile),
    setUserData,
    speechInitialized,
    () => {} // setSpeechInitialized is not needed here
  );

  // Update status based on mobile detection
  useEffect(() => {
    if (isMobile && isListeningEnabled) {
      setStatus("Tap to speak");
    } else if (!isMobile && isListeningEnabled) {
      setStatus("Listening...");
    } else {
      setStatus("Listening Disabled");
    }
  }, [isMobile, isListeningEnabled]);

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
  }, [userData, soundEnabled, speak]);

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
        {isMobile && (
          <button
            className="w-full max-w-[200px] h-[50px] text-black font-bold bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 rounded-full text-[14px] cursor-pointer shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={() => {
              speak("Hello! This is a test message to check if speech synthesis works on mobile.", () => {
                console.log("Test speech completed");
              });
            }}
          >
            🧪 Test Speech
          </button>
        )}
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
      {isMobile && !speechInitialized && (
        <p className="text-yellow-300 text-[12px] md:text-[14px] text-center max-w-[300px]">
          💡 Tap anywhere on the screen first to enable voice features
        </p>
      )}
      {isMobile && isListeningEnabled && (
        <button
          className="w-full max-w-[200px] h-[50px] text-black font-bold bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 rounded-full text-[16px] cursor-pointer shadow-lg transform hover:scale-105 transition-all duration-200"
          onClick={startMobileListening}
        >
          🎤 Tap to Speak
        </button>
      )}
      <h1 className="text-white">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
}

export default Home;
