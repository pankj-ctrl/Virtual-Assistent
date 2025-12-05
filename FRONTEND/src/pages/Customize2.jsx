import React, { useContext, useState } from "react";
import { userDataContext } from "../context/userContext";
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
        console.log("Error response:", error.response?.data)
        console.log("Error status:", error.response?.status)
        console.log(error)
      }
    }

    return(
        <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[15px] md:p-[20px] gap-[15px] md:gap-[20px]" >
         <MdKeyboardBackspace 
            className="absolute top-[20px] md:top-[30px] left-[20px] md:left-[30px] text-white w-[20px] md:w-[25px] h-[20px] md:h-[25px] cursor-pointer" 
            onClick={() => navigate("/customize")}
          />
          <h1 className="text-white text-[24px] md:text-[30px] text-center p-[15px] md:p-[20px]">
            Enter Your <span className="text-blue-200">Assistant Name</span>
          </h1>

          <input
            type="text"
            placeholder="eg: Jarvis"
            className="w-full max-w-[600px] h-[50px] md:h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] md:py-[15px] rounded-full text-[16px] md:text-[18px] mb-[10px] md:mb-[15px]"
            required 
            onChange={(e) => setAssistantName(e.target.value)}
            value={assistantName}
          />
          
          {assistantName && (
            <button 
              className="min-w-[200px] md:min-w-[300px] h-[50px] md:h-[60px] text-black font-semibold mt-[20px] md:mt-[30px] mb-[10px] bg-white rounded-full text-[16px] md:text-[19px] cursor-pointer " disabled={loading}
              onClick={() => {
                handleUpdateAssistant()
              }}
            >
              { !loading ? "Finally Create Your Assistant":"Loading..."}
            </button>
          )}
        </div>
    )
}

export default Customize2