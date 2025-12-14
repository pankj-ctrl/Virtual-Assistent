import axios from "axios"

const grokResponse = async (command, assistantName, userName, retryCount = 0) => {
  const maxRetries = 2;

  try {

    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:

{
  "type": "general" | "google_search" | "open_google" | "youtube_search" | "youtube_play" | "open_youtube" |
  "get_time" | "get_date" | "get_day" | "get_month" | "open_calculator" |
  "instagram_open" | "facebook_open" | "weather_show" | "open_vscode",
  "userinput": "<original user input> (only remove your name from userinput if exists) 
  and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userinput me only search bala text jaye,
  "response": "<a short spoken response to read out loud to the user>"
}

Instructions:
- "type": determine the intent of the user.
- "userinput": original sentence the user spoke.
- "response": a short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

Type meanings:
- "general": if it's a factual or informational question.aur agar koi  aisa question puchta hai jiska answer tume pata hai usko bhi general ke   category mai rkho or uska bas short answer dena
- "open_google": if user wants to open google
- "open_youtube": if user wants to open youtube
- "google_search": if user wants to search something on Google.
- "youtube_search": if user wants to search something on YouTube.
- "youtube_play": if user wants to directly play a video or song.
- "open_calculator": if user wants to open a calculator.
- "instagram_open": if user wants to open Instagram.
- "facebook_open": if user wants to open Facebook.
- "weather_show": if user wants to know weather.
- "get_time": if user asks for current time.
- "get_date": if user asks for today's date.
- "get_day": if user asks what day it is.
- "get_month": if user asks for the current month.
- "open_vscode": if user want to vscode. ya visual studio code
- "open_edge": if user want open microsoft edge. and if user say open brower
- "open_camera": if user want open camara.
- "open_clock": if user asks for open the clock
- "open_photos": if user asks for open photos
- "open_settings": if user asks for open setting
- "open_whatsapp": if user wants for open whatsapp
  Important:
- Use ${userName} agar koi puche tune kisne banaya.
- use ${userName} agar koi puche mai kon hu. or mera naam kya hai.ok
- Only respond with the JSON object, nothing else.

Now produce the JSON for this user input:
${command}
`
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: process.env.OPENROUTER_MODEL || "x-ai/grok-4.1-fast",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      reasoning: {
        enabled: true
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      timeout: 30000 // 30 second timeout
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(`Error calling Grok API (attempt ${retryCount + 1}):`, error.response?.data || error.message);

    // Retry for network errors or 5xx server errors
    if (retryCount < maxRetries && (
      !error.response ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.response.status >= 500
    )) {
      console.log(`Retrying request... (${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
      return grokResponse(command, assistantName, userName, retryCount + 1);
    }

    // Provide fallback JSON response for common errors
    if (error.response?.status === 429) {
      // Rate limit exceeded
      return JSON.stringify({
        type: "general",
        userinput: command,
        response: "I'm receiving too many requests right now. Please try again in a moment."
      });
    } else if (error.response?.status === 401) {
      // Invalid API key
      return JSON.stringify({
        type: "general",
        userinput: command,
        response: "There's an issue with my configuration. Please contact support."
      });
    } else if (error.response?.status >= 500) {
      // Server error
      return JSON.stringify({
        type: "general",
        userinput: command,
        response: "I'm having trouble connecting to my brain right now. Please try again."
      });
    } else {
      // Generic fallback
      return JSON.stringify({
        type: "general",
        userinput: command,
        response: "Sorry, I couldn't process that request. Please try again."
      });
    }
  }
}

export default grokResponse