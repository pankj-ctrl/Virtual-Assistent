import React, { useContext, useRef, useState } from "react";
import img1 from "../assets/img1.png"
import img2 from "../assets/img2.png"
import img3 from "../assets/img3.png"
import img4 from "../assets/img4.png"
import img5 from "../assets/img5.png"
import img6 from "../assets/auth5.png"
import Card from "../components/Card.jsx";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize(){
    const{
        serverUrl,
        userData,
        setUserData,
        frontedImage,
        setFrontedImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
    } = useContext(userDataContext)
    
    const navigate = useNavigate()
    const inputImage = useRef()
    
    const handleImage = (e) => {
      const file = e.target.files[0]
      setBackendImage(file)
      setFrontedImage(URL.createObjectURL(file))
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
           onClick={() => navigate("/")}
         />
            <div className="relative z-10 flex flex-col items-center gap-[20px] w-full max-w-2xl px-6">
              <h1 className="text-white text-[24px] md:text-[30px] text-center font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                Select your <span className="text-blue-400">Assistant Image</span>
              </h1>
              
              <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]">
                <Card image={img1}/>
                <Card image={img2}/>
                <Card image={img3}/>
                <Card image={img4}/>
                <Card image={img5}/>
                <Card image={img6}/>

                <div 
                  className={`w-[60px] h-[120px] md:w-[70px] md:h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220]/50 border-2 border-[#0000ff66] rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center backdrop-blur-sm ${selectedImage=="input"?"border-4 border-white shadow-blue-950 shadow-2xl":null}`} 
                  onClick={()=>{
                    inputImage.current.click()
                    setSelectedImage("input")
                  }}
                >
                  {!frontedImage && <RiImageAddLine className="text-white w-[20px] md:w-[25px] h-[20px] md:h-[25px]"/>}
                  {frontedImage && <img src={frontedImage} className="h-full w-full object-cover rounded-2xl"/>}
                   
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={inputImage} 
                    hidden 
                    onChange={handleImage}
                  />
                </div>
              </div>
              
              {selectedImage && (
                <button 
                  className="w-full max-w-[300px] h-[50px] md:h-[60px] text-white font-semibold bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 rounded-xl text-[16px] md:text-[19px] cursor-pointer shadow-lg hover:shadow-green-500/25 transform hover:scale-[1.02] transition-all duration-300 border border-green-400/20 hover:border-green-400/40" 
                  onClick={() => navigate("/customize2")}
                >
                  Next Step
                </button>
              )}
            </div>
        </div>
    )
}

export default Customize
