import User from "../models/user.model.js"
import  uploadOnCloudinary from "../config/cloudinary.js"
import grokResponse from "../grok.js"
import { json } from "express"
import moment from "moment/moment.js"


export const getCurrentUser = async(req,res)=>{
    try {
        const userId = req.userId
        const user= await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        
        return res.status(200).json(user)
       

    } catch (error) {
         return res.status(400).json({message:"get current user error"})
    }
}

export const updateAssistant = async(req,res)=>{
  try {
    const{assistantName,imageUrl}=req.body
    let assistantImage;
    
    if(req.file){
        assistantImage=await  uploadOnCloudinary(req.file.path)
    }else{
        assistantImage=imageUrl
    }
    const user= await User.findByIdAndUpdate(req.userId,{assistantName,assistantImage},{new:true}).select("-password")
    return res.status(200).json(user)
  } catch (error) {
     return res.status(400).json({message:"upadate Assistant Error"})
  }
}

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await grokResponse(command, assistantName, userName);

    const textResult =
      typeof result === "string" ? result : JSON.stringify(result);

    console.log("LLM raw result:", textResult); // temporary debugging

    const jsonMatch =
      textResult && textResult.match
        ? textResult.match(/{[\s\S]*}/)
        : null;

    if (!Array.isArray(jsonMatch) || jsonMatch.length === 0) {
      console.error(
        "askToAssistant: could not find JSON in LLM result:",
        textResult
      );
      return res.status(400).json({
        response: "sorry, i can't understand",
        raw: textResult,
      });
    }

    let grokResult;
    try {
      grokResult = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("JSON parse error in askToAssistant:", e, jsonMatch[0]);
      return res.status(400).json({
        response: "Invalid JSON from model",
        raw: jsonMatch[0],
      });
    }

    const type = grokResult.type;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: grokResult.userInput || command,
          response: `current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get_time":
        return res.json({
          type,
          userInput: grokResult.userInput || command,
          response: `current time is ${moment().format("hh:mm A")}`,
        });

      case "get_day": // avoid duplicate 'get-date'
        return res.json({
          type,
          userInput: grokResult.userInput || command,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput: grokResult.userInput || command,
          response: `Today is ${moment().format("MMMM")}`,
        });

      case "youtube_search":
      case "youtube_play":
      case "google_search":
      case "open_youtube":
      case "general":
      case "github_search":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "google_open":
      case "weather_show":
        return res.json({
          type,
          userInput: grokResult.userInput || command,
          response: grokResult.response,
        });

      default:
        return res
          .status(400)
          .json({ response: "I didn't understand that command" });
    }

    // Add to history
    user.history.push(command);
    if (user.history.length > 10) {
      user.history.shift(); // Remove oldest
    }
    await user.save();
  } catch (error) {
    console.error("askToAssistant error:", error.message);
    console.error("Error details:", error.response?.data || error);

    // Provide more specific error messages
    let errorMessage = "Sorry, I couldn't process that request right now.";

    if (error.message?.includes('timeout')) {
      errorMessage = "The request timed out. Please try again.";
    } else if (error.response?.status === 429) {
      errorMessage = "Too many requests. Please wait a moment and try again.";
    } else if (error.response?.status === 401) {
      errorMessage = "Authentication failed. Please log in again.";
    } else if (error.response?.status >= 500) {
      errorMessage = "Server error. Please try again later.";
    }

    return res.status(500).json({
      response: errorMessage,
      type: "general",
      userInput: req.body.command || "unknown"
    });
  }
};
