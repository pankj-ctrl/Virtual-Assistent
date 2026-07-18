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
- You MUST return ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json.

Now produce the JSON for this user input:
${command}
`
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      // It's better to use a code model here if possible, like "cohere/command-r"
      model: process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      // Bhai, reasoning ko false rakho jab JSON chahiye ho, warna model extra text append kar deta hai
      reasoning: {
        enabled: false 
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      timeout: 30000 
    });

    let rawResult = response.data.choices[0].message.content;

    // 1. Agar model sirf safety error bhej de aur usme JSON brackets {} na ho
    if (rawResult.includes("User Safety: safe") && !rawResult.includes("{")) {
        return JSON.stringify({
            type: "general",
            userinput: command,
            response: "Mujhe yeh process karne se roka gaya hai due to safety filters."
        });
    }

    // 2. Regex se sirf JSON ko extract karna (extra text ignore ho jayega)
    const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return jsonMatch[0]; // Yeh strictly valid JSON string return karega
    }

    // 3. Agar upar kuch kaam na aaye toh raw return kar do
    return rawResult;

  } catch (error) {
    console.error(`Error calling API (attempt ${retryCount + 1}):`, error.response?.data || error.message);

    if (retryCount < maxRetries && (
      !error.response ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.response.status >= 500
    )) {
      console.log(`Retrying request... (${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); 
      return grokResponse(command, assistantName, userName, retryCount + 1);
    }

    if (error.response?.status === 429) {
      return JSON.stringify({
        type: "general",
        userinput: command,
        response: "I'm receiving too many requests right now. Please try again in a moment."
      });
    } else if (error.response?.status === 401) {
      return JSON.stringify({
        type: "general",
        userinput: command,
        response: "There's an issue with my configuration. Please contact support."
      });
    } else if (error.response?.status >= 500) {
      return JSON.stringify({
        type: "general",
        userinput: command,
        response: "I'm having trouble connecting to my brain right now. Please try again."
      });
    } else {
      return JSON.stringify({
        type: "general",
        userinput: command,
        response: "Sorry, I couldn't process that request. Please try again."
      });
    }
  }
}

export default grokResponse;
