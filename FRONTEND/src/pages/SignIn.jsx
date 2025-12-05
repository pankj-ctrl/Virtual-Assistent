import React, { useContext, useState } from "react";
import bg from "../assets/auth5.png";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Gmail validation function
  const validateGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  // Handle email input change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateGmail(value)) {
      setEmailError("Please enter a valid Gmail address (e.g., example@gmail.com)");
    } else {
      setEmailError("");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate Gmail before submission
    if (!validateGmail(email)) {
      setEmailError("Please enter a valid Gmail address");
      setLoading(false);
      return;
    }

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      setUserData(result.data)
      navigate("/")
      
    } catch (error) {
      console.log("Login error:", error);
      setUserData(null)
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-[100vh] flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] min-h-[500px] max-w-[600px] bg-[#00000027] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[15px] md:gap-[20px] px-[20px] py-[20px] rounded-2xl mr-[10px] md:mr-[30px]"
        onSubmit={handleSignIn}
      >
        <h1 className="text-white text-[24px] md:text-[30px] font-semibold mb-[20px] md:mb-[30px]">
          Welcome Back to{" "}
          <span className="text-blue-800">Virtual Assistant</span>
        </h1>

        {error && (
          <p className="text-red-400 text-center bg-red-900/20 p-2 rounded-lg w-full">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className={`w-full h-[50px] md:h-[60px] outline-none border-2 bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] md:py-[15px] rounded-full text-[16px] md:text-[18px] mb-[10px] md:mb-[15px] transition-all duration-300 ${
            emailError ? 'border-red-400 bg-red-900/10' : 'border-white'
          }`}
          required
          onChange={handleEmailChange}
          value={email}
        />

        {emailError && (
          <p className="text-red-400 text-center bg-red-900/20 p-2 rounded-lg w-full text-sm mb-[10px]">
            {emailError}
          </p>
        )}

        <div className="w-full h-[50px] md:h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[16px] md:text-[18px] mb-[10px] md:mb-[15px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px] md:py-[15px]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          {!showPassword && (
            <IoEye
              className="absolute top-[12px] md:top-[18px] right-[20px] text-white w-[20px] md:w-[25px] h-[20px] md:h-[25px] cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
          {showPassword && (
            <IoEyeOff
              className=" absolute top-[12px] md:top-[18px] right-[20px] text-white w-[20px] md:w-[25px] h-[20px] md:h-[25px] cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        <button
          className="w-full max-w-[200px] h-[50px] md:h-[60px] text-black font-semibold bg-white rounded-full text-[16px] md:text-[19px] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p
          className="text-white text-[14px] md:text-[18px] cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Don't have an account ? <span className="text-blue-400">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
