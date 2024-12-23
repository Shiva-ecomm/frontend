import React, { useState } from 'react';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/host';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
// import { Button } from '@shadcn/ui';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loader, setLoader] = useState(false);

    const handleSubmit = async () => {
        setLoader(true);
        try {
            const res = await axios.post(`${host}/user/forgot-password`, { email });
            if (res.data.success) {
                message.success('An email has been sent to the provided Email ID');
            }
        } catch (error) {
            console.log(error.message);
            message.error('Something went wrong');
        }
        setLoader(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                    Forgot Password
                </h2>

                {loader ? (
                    <div className="text-center text-gray-700 dark:text-gray-300">
                        <span>The password reset link has been sent to your email ID</span>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Enter Your Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter Your Email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-primary-500"
                                />
                                <FaEnvelope className="absolute right-3 top-3 text-gray-500 dark:text-gray-400" />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!email}
                            className="w-full bg-primary-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            Submit
                        </button>

                        <div className="mt-4 text-center">
                            <span className="text-gray-700 dark:text-gray-300">Remembered your password? </span>
                            <Link to="/login" className="text-primary-500 hover:underline">Login</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
