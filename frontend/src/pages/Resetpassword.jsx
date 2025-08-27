import React from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";

const Resetpassword = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 ">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      {/* enter the email */}
      <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Password
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter your registered email address.
        </p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-xl bg-[#26667F]">
          <img src={assets.mail_icon} alt="" />
          <input
            type="email"
            className="bg-transparent outline-none"
            placeholder="Email"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default Resetpassword;
