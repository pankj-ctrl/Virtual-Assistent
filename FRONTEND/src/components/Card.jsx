import React, { useContext } from "react";
import { userDataContext } from "../context/userContext";

function Card({ image }) {
    const {
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
    
    return(
        <div 
          className={`w-[60px] h-[120px] md:w-[70px] md:h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage==image?"border-4 border-white shadow-blue-950 shadow-2xl":null}`} 
          onClick={() => {
            setSelectedImage(image)
            setBackendImage(null)
            setFrontedImage(null)
          }}
        >
          <img src={image} className="h-full w-full object-cover"/>
        </div>
    )
}

export default Card