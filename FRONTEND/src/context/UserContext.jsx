import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "https://virtual-assistent-backend-yd97.onrender.com";
  
  const [userData, setUserData] = useState(null);
  const [frontedImage, setFrontedImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      if (error.response && error.response.status !== 400) {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const getGrokResponse = async (command)=>{
   try {
    const result= await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
    return result.data
   } catch (error) {

     // More specific error messages based on error type
     if (error.response?.status === 429) {
       return { type: 'general', userInput: command, response: 'I\'m receiving too many requests right now. Please try again in a moment.' }
     } else if (error.response?.status === 500) {
       return { type: 'general', userInput: command, response: 'I\'m having trouble connecting to my brain right now. Please try again.' }
     } else if (error.response?.status === 401) {
       return { type: 'general', userInput: command, response: 'Authentication issue. Please try logging in again.' }
     } else {
       return { type: 'general', userInput: command, response: 'Sorry, I couldn\'t process that request. Please try again.' }
     }
   }
  }

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontedImage,
    setFrontedImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGrokResponse
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
