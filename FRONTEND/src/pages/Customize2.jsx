import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize2(){
    const {
        userData,
        backendImage,
        selectedImage,
        serverUrl,
        setUserData
    } = useContext(userDataContext)
    
    const navigate = useNavigate()
    
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
    const [loading,setLoading]=useState(false)
    
    const handleUpdateAssistant = async() => {
      try {
        let data = {
          assistantName: assistantName
        }

        if(backendImage) {
          let formData = new FormData()
          formData.append("assistantName", assistantName)
          formData.append("assistantImage", backendImage)
          
          const result = await axios.post(
            `${serverUrl}/api/user/update`, 
            formData, 
            { withCredentials: true }
          )
          
          setUserData(result.data)
          
          navigate("/")
        } else {
          data.imageUrl = selectedImage
          
          const result = await axios.post(
            `${serverUrl}/api/user/update`, 
            data, 
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          
          setUserData(result.data)
          
          navigate("/")
        }

      } catch (error) {
      }
    }

    return(
        <div className="w-full min-h-[100vh] bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex justify-center items-center flex-col gap-[20px] relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10 animate-pulse"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-500/5 rounded-full blur-lg animate-ping" style={{animationDelay: '0.5s'}}></div>
         <MdKeyboardBackspace 
            className="absolute top-[20px] md:top-[30px] left-[20px] md:left-[30px] text-white w-[20px] md:w-[25px] h-[20px] md:h-[25px] cursor-pointer z-10 hover:text-blue-400 transition-colors duration-200" 
            onClick={() => navigate("/customize")}
          />
          <div className="relative z-10 flex flex-col items-center gap-[20px] w-full max-w-md px-6">
            <h1 className="text-white text-[24px] md:text-[30px] text-center font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
              Enter Your <span className="text-blue-400">Assistant Name</span>
            </h1>

            <input
              type="text"
              placeholder="eg: Jarvis"
              className="w-full h-[50px] md:h-[60px] outline-none border-2 border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-gray-300 px-[20px] py-[10px] md:py-[15px] rounded-xl text-[16px] md:text-[18px] focus:border-blue-400 focus:bg-white/15 transition-all duration-300 shadow-lg"
              required 
              onChange={(e) => setAssistantName(e.target.value)}
              value={assistantName}
            />
            
            {assistantName && (
              <button 
                className="w-full h-[50px] md:h-[60px] text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-[16px] md:text-[19px] cursor-pointer shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02] transition-all duration-300 border border-blue-400/20 hover:border-blue-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={() => {
                  handleUpdateAssistant()
                }}
              >
                { !loading ? "Finally Create Your Assistant" : "⏳ Loading..."}
              </button>
            )}
          </div>
        </div>
    )
}

export default Customize2
