import React, { useState } from 'react';
import '../styles/ForgotPassword.css';
import { TERipple } from "tw-elements-react";
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/host';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const params=useParams();
    const navigate=useNavigate()

   

    const handleSubmit=async()=>{
        try{
            const res=await axios.post(`${host}/user/reset-password/${params?.id}`,{password});
            if(res.data.success){
                message.success(res.data.message)
                navigate('/login')
            }

        }catch(error){
            // console.log(error.message);
            message.error('Something went wrong');
        }
    }
    return (
        <div className='forgot-container'>
            <div className='forgot-password'>
                <h2 className='text-2xl font-bold text-center mb-6'>
                    <span className='text-primary'>Reset Password</span>
                </h2>

                <div className='input-group'>
                    <label className='input-label'>Enter New Password</label>
                    <input 
                        type='password' 
                        placeholder='Enter Your New Password' 
                        name='password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                
                <TERipple rippleColor="light">
                    <button
                        type="button"
                        className="add-btn inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow transition duration-150 ease-in-out hover:bg-primary-600 focus:outline-none"
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
