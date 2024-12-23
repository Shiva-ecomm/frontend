import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { FaUser, FaPhone, FaEnvelope, FaLock } from "react-icons/fa"; // Icons for name, phone, email, password
import axios from "axios";
import host from "../APIRoute/host";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !name || !phone) {
      message.error("Please provide email, password, name, and phone");
      return;
    }

    try {
      const res = await axios.post(`${host}/user/register`, { email, password, name, phone });

      if (res.data.success) {
        message.success(res.data.message);
        navigate("/login");
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
                <p className="text-gray-600 dark:text-gray-400">Please register to continue</p>
              </div>

              <div className="space-y-4">
                {/* Name input */}
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-primary focus:border-primary dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Phone input */}
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-primary focus:border-primary dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Email input */}
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

                {/* Password input */}
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

                {/* Submit button */}
                <button
                  onClick={handleRegister}
                  className="w-full px-4 py-2 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-md hover:opacity-90 focus:outline-none"
                >
                  Register
                </button>
              </div>

              <div className="flex justify-between items-center mt-6 text-sm">
                <span className="text-indigo-500 cursor-pointer hover:underline">
                  <Link to="/forgot-password">Forgot password?</Link>
                </span>
                <Link to="/login" className="text-indigo-500 hover:underline">
                  Already have an account? Log in
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2024 The Shiva Group. All rights reserved.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
