import React, { useContext, useRef, useState } from "react";
import img1 from "../assets/img1.png"
import img2 from "../assets/img2.png"
import img3 from "../assets/img3.png"
import img4 from "../assets/img4.png"
import img5 from "../assets/img5.png"
import img6 from "../assets/auth5.png"
import Card from "../components/Card.jsx";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/userContext";
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
        <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[15px] md:p-[20px] gap-[15px] md:gap-[20px]">
          <MdKeyboardBackspace 
           className="absolute top-[20px] md:top-[30px] left-[20px] md:left-[30px] text-white w-[20px] md:w-[25px] h-[20px] md:h-[25px] cursor-pointer" 
           onClick={() => navigate("/")}
         />
            <h1 className="text-white text-[24px] md:text-[30px] text-center p-[15px] md:p-[20px]">
              Select your <span className="text-blue-200">Assistant Image</span>
            </h1>
            
            <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]">
              <Card image={img1}/>
              <Card image={img2}/>
              <Card image={img3}/>
              <Card image={img4}/>
              <Card image={img5}/>
              <Card image={img6}/>

              <div 
                className={`w-[60px] h-[120px] md:w-[70px] md:h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage=="input"?"border-4 border-white shadow-blue-950 shadow-2xl":null}`} 
                onClick={()=>{
                  inputImage.current.click()
                  setSelectedImage("input")
                }}
              >
                {!frontedImage && <RiImageAddLine className="text-white w-[20px] md:w-[25px] h-[20px] md:h-[25px]"/>}
                {frontedImage && <img src={frontedImage} className="h-full w-full object-cover"/>}
                 
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
                className="min-w-[150px] h-[50px] md:h-[60px] text-black font-semibold mt-[20px] md:mt-[30px] mb-[10px] bg-white rounded-full text-[16px] md:text-[19px] cursor-pointer " 
                onClick={() => navigate("/customize2")}
              >
                Next
              </button>
            )}
        </div>
    )
}

export default Customize