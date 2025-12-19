# Virtual Assistant (Full Stack AI Application)

Ek modern, full-stack virtual assistant application jo MERN stack (MongoDB, Express, React, Node.js) par bani hai. Is app mein users apna account bana sakte hain aur apne assistant ko custom name aur image ke saath personalize kar sakte hain, jo Grok AI se chalta hai.

**Live Link:** [https://virtual-assistent-myv3.onrender.com/](https://virtual-assistent-myv3.onrender.com/)

---

## 🚀 Features

* **User Authentication**: Secure Sign-Up aur Sign-In features bcryptjs aur JWT ka use karke.
* **Assistant Customization**: User apne assistant ka naam chun sakta hai aur image upload kar sakta hai (Cloudinary ke zariye).
* **AI Integration**: Grok AI ka use karke intelligent sawaal-jawaab.
* **Voice Features**: Speech Recognition aur Speech Synthesis ka support.
* **Protected Routes**: Bina login aur customization ke dashboard access nahi kiya ja sakta.

---

## 🛠️ Tech Stack

### Backend
* **Node.js & Express**: Server framework.
* **MongoDB & Mongoose**: Database management.
* **Cloudinary**: Assistant ki images store karne ke liye.
* **JWT & Cookie-Parser**: Authentication aur session handling.

### Frontend
* **React (v19) & Vite**: Modern UI aur fast development.
* **Tailwind CSS**: Styling ke liye.
* **React Router Dom**: Client-side routing.
* **Axios**: API calls ke liye.

---

## ⚙️ Installation & Setup

Niche diye gaye steps ko follow karke project ko local system par chalayein:

### 1. Prerequisites
* Node.js installed
* MongoDB Atlas account
* Cloudinary API keys
* Grok AI API key

### 2. Backend Setup
1.  **Backend folder mein jayein:**
    ```bash
    cd BACKEND
    ```
2.  **Dependencies install karein:**
    ```bash
    npm install
    ```
3.  **Environment Variables (.env) banayein:**
    ```env
    PORT=5000
    MONGO_URI=aapka_mongodb_link
    JWT_SECRET=aapka_secret_key
    CLOUDINARY_CLOUD_NAME=aapka_name
    CLOUDINARY_API_KEY=aapka_key
    CLOUDINARY_API_SECRET=aapka_secret
    GROK_API_KEY=aapka_grok_key
    ```
4.  **Server start karein:**
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
1.  **Frontend folder mein jayein:**
    ```bash
    cd ../FRONTEND
    ```
2.  **Dependencies install karein:**
    ```bash
    npm install
    ```
3.  **App start karein:**
    ```bash
    npm run dev
    ```

---


## 👤 Author
**Pankaj Singh**
