export const handleCommand = (data, speak, setStatus, isMobile) => {
  const { type, userInput, response } = data;
  setStatus("Answering");
  speak(response, () => setStatus(isMobile ? "Tap to speak" : "Listening..."));

  if (type === "google_search") {
    let query = userInput
      .toLowerCase()
      .replace(/search\s+on\s+google\s+for\s+/gi, "")
      .replace(/google\s+search\s+for\s+/gi, "")
      .replace(/search\s+for\s+/gi, "")
      .replace(/on\s+google\s+/gi, "")
      .replace(/search\s+google\s+/gi, "")
      .replace(data.userData?.assistantName?.toLowerCase() || "", "")
      .replace("search", "")
      .replace("on", "")
      .trim();

    const encoded = encodeURIComponent(query);
    window.open(`https://www.google.com/search?q=${encoded}`, "_blank");
  }
  if (type === "open_google") {
    const query = encodeURIComponent(userInput);
    window.open(`https://www.google.com`, "_blank");
  }
  
   if (type === "open_vscode") {
    window.location.href = "vscode:";
  }
  if (type === "calculator_open") {
    window.open(`https://www.google.com/search?q=calculator`, "_blank");
  }

  if (type === "instagram_open") {
    window.open(`https://www.instagram.com/`, "_blank");
  }

  if (type === "facebook_open") {
    window.open(`https://www.facebook.com/`, "_blank");
  }

  if (type === "weather_show") {
    window.open(`https://www.google.com/search?q=weather`, "_blank");
  }
  if (type === "open_youtube") {
    window.open(`https://www.youtube.com/`, "_blank");
  }
  if (type === "youtube_search") {
    let query = userInput
      .toLowerCase()
      .replace("youtube", "")
      .replace("on", "")
      .replace(data.userData?.assistantName?.toLowerCase() || "", "")
      .replace("search", "")
      .replace("play", "")
      .trim();

    const encoded = encodeURIComponent(query);
    window.open(
      `https://www.youtube.com/results?search_query=${encoded}`,
      "_blank"
    );
  }

  if (type === "youtube_play") {
    let query = userInput
      .toLowerCase()
      .replace("youtube", "")
      .replace("on", "")
      .replace(data.userData?.assistantName?.toLowerCase() || "", "")
      .replace("play", "")
      .trim();

    const encoded = encodeURIComponent(query);
    window.open(
      `https://www.youtube.com/results?search_query=${encoded}`,
      "_blank"
    );
  }
};