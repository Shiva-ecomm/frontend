import React, { useState } from 'react';
import { TERipple } from "tw-elements-react";
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/host';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLock } from 'react-icons/fa'; // Icon for lock

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const params = useParams();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const res = await axios.post(`${host}/user/reset-password/${params?.id}`, { password });
            if (res.data.success) {
                message.success(res.data.message);
                navigate('/login');
            }
        } catch (error) {
            message.error('Something went wrong');
        }
    };

    return (
        <div className="forgot-container min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="forgot-password bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
                    <span className="text-primary">Reset Password</span>
                </h2>

                <div className="input-group mb-4">
                    <label className="input-label text-sm font-medium text-gray-700 dark:text-gray-300">Enter New Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Enter Your New Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-primary"
                        />
                        <FaLock className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    </div>
                </div>

                <TERipple rippleColor="light">
                    <button
                        type="button"
                        className="add-btn w-full inline-block rounded bg-primary px-6 py-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                        onClick={handleSubmit}
                        disabled={!password}
                    >
                        Submit
                    </button>
                </TERipple>
            </div>
        </div>
    );
};

export default ResetPassword;
