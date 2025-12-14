export const handleCommand = (data, speak, setStatus, isMobile) => {
  const { type, userInput, response } = data;

  setStatus("Answering");
  speak(response, () => setStatus(isMobile ? "Tap to speak" : "Listening..."));

  
  if (isMobile) {
    
    // 1. WhatsApp Kholna (Phone command ke liye)
    if (type === "open_phone") {
      window.open("whatsapp://", "_self");
      return;
    }

     if (type === "open_youtube") {
      window.open("youtube://", "_self"); 
      setTimeout(() => {
          window.open("https://m.youtube.com", "_blank");
      }, 1000);
      return;
    }
    // 2. Message / SMS App Kholna
    if (type === "open_sms") {
      window.open("sms:", "_self");
      return;
    }

    // 3. WhatsApp (Mobile Logic)
    if (type === "open_whatsapp") {
      window.open("whatsapp://", "_self");
      return;
    }

    // 4. Instagram App Kholna (Deep Link)
    if (type === "instagram_open") {
      // Pehle App kholne ki koshish, nahi toh website
      setTimeout(() => {
        window.open("https://www.instagram.com", "_blank");
      }, 500);
      window.open("instagram://app", "_self");
      return;
    }

    // 5. Maps / Navigation
    if (type === "open_maps") {
      window.open("geo:0,0?q=", "_self"); // Maps app kholega
      return;
    }
  }


  if (!isMobile) {
    
    // WhatsApp Desktop
    if (type === "open_whatsapp") {
      window.location.href = "whatsapp://";
      setTimeout(() => {
        if (document.hasFocus()) {
          window.open("https://web.whatsapp.com", "_blank");
        }
      }, 1500);
      return;
    }

    if (type === "open_edge") {
      window.location.href = "microsoft-edge:https://www.google.com";
    }

    if (type === "open_camera") {
      window.location.href = "microsoft.windows.camera:";
    }

    if (type === "open_clock") {
      window.location.href = "ms-clock:";
    }

    if (type === "open_photos") {
      window.location.href = "ms-photos:";
    }

    if (type === "open_settings") {
      window.location.href = "ms-settings:";
    }
    if (type === "open_vscode") {
    window.location.href = "vscode:";
    if (type === "open_email") {
    window.location.href = "mailto:";
  }
  if (type === "open_zoom") {
    window.location.href = "zoommtg:";
  }
  }
  }

  // ---------------------------------------------------------
  // 🌍 COMMON COMMANDS (Mobile aur PC dono par chalenge)
  // ---------------------------------------------------------

  if (type === "open_chrome" || type === "open_google") {
    window.open("https://www.google.com", "_blank");
  }

  if (type === "google_search") {
    let query = userInput
      .toLowerCase()
      .replace(/search\s+on\s+google\s+for\s+/gi, "")
      .replace(/google\s+search\s+for\s+/gi, "")
      .replace(/search\s+for\s+/gi, "")
      .replace(/on\s+google\s+/gi, "")
      .replace(/search\s+google\s+/gi, "")
      .replace("search", "")
      .trim();
    const encoded = encodeURIComponent(query);
    window.open(`https://www.google.com/search?q=${encoded}`, "_blank");
  }

  if (type === "open_youtube") {
    window.open("https://www.youtube.com/", "_blank");
  }

  if (type === "youtube_search") {
    let query = userInput
      .toLowerCase()
      .replace("youtube", "")
      .replace("search", "")
      .replace("play", "")
      .trim();
    const encoded = encodeURIComponent(query);
    window.open(`https://www.youtube.com/results?search_query=${encoded}`, "_blank");
  }

  if (type === "youtube_play") {
    let query = userInput
      .toLowerCase()
      .replace("youtube", "")
      .replace("play", "")
      .trim();
    const encoded = encodeURIComponent(query);
    window.open(`https://www.youtube.com/results?search_query=${encoded}`, "_blank");
  }
};