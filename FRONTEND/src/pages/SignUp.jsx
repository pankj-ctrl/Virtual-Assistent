import React, { useContext, useState } from "react";
import bg from "../assets/auth5.png";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext.jsx";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      setUserData(result.data)
      setLoading(false);
      navigate("/customize")
    } catch (error) {
      console.log(error);
      setUserData(null)
      setErr(error.response.data.message);
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
        onSubmit={handleSignUp}
      >
        <h1 className="text-white text-[24px] md:text-[30px] font-semibold mb-[20px] md:mb-[30px]">
          Register to <span className="text-blue-800">Virtual Assistant</span>
        </h1>

        {err && (
          <p className="text-red-400 text-center bg-red-900/20 p-2 rounded-lg w-full">
            {err}
          </p>
        )}

        <input
          type="text"
          placeholder="Enter your name"
          className="w-full h-[50px] md:h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] md:py-[15px] rounded-full text-[16px] md:text-[18px] mb-[10px] md:mb-[15px]"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full h-[50px] md:h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] md:py-[15px] rounded-full text-[16px] md:text-[18px] mb-[10px] md:mb-[15px]"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

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
        {err.length > 0 && <p className="text-red-800 text-[16px] md:text-[20px] ">*{err}</p>}
        <button
          className="min-w-[150px] h-[50px] md:h-[60px] text-black font-semibold mt-[20px] md:mt-[30px] mb-[10px] bg-white rounded-full text-[16px] md:text-[19px] cursor-pointer "
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p
          className="text-white text-[14px] md:text-[18px] cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account ? <span className="text-blue-400">Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
