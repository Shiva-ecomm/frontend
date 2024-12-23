import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import host from "../APIRoute/host";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      message.error("Please provide email and password");
      return;
    }

    try {
      const res = await axios.post(`${host}/user/login`, {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success(res.data.message);
        dispatch(setUser(res.data.user));
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "An error occurred. Please try again.");
      } else {
        message.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <section className="h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto flex h-full items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg shadow-lg bg-white dark:bg-gray-800">
            <div className="p-6">
              <div className="text-center mb-6">
                <img
                  src="/images/final_logo_png_file-removebg-preview.png"
                  alt="logo"
                  className="mx-auto w-24"
                />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Welcome to The Shiva Group
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Please log in to continue</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-primary focus:border-primary dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-primary focus:border-primary dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-2 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-md hover:opacity-90 focus:outline-none"
                >
                  Log In
                </button>
              </div>

              <div className="flex justify-between items-center mt-6 text-sm">
                <span
                  className="text-indigo-500 cursor-pointer hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </span>
                <Link to="/register" className="text-indigo-500 hover:underline">
                  Create an account
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              © 2024 The Shiva Group. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
