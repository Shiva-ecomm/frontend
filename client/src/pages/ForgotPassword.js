import React, { useState } from 'react';
import '../styles/ForgotPassword.css';
import { TERipple } from "tw-elements-react";
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/host';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loader,setLoader]=useState(false)

    const handleSubmit=async()=>{
        setLoader(false)
        try{
            const res=await axios.post(`${host}/user/forgot-password`,{email});
            if(res.data.success){
                message.success('A email has been sent to the provided Email ID')
            }

        }catch(error){
            console.log(error.message);
            message.error('Something went wrong');
        }
        setLoader(true)
    }
    return (
        <div className='forgot-container'>
            <div className='forgot-password'>
                <h2 className='text-2xl font-bold text-center mb-6'>
                    <span className='text-primary'>Forgot Password</span>
                </h2>
        {
            loader ? <div><span>The Password Link has been sent to your Email Id</span></div>
        :
        <>
                <div className='input-group'>
                    {/* <label className='input-label'>Enter your Email</label> */}
                    <input 
                        type='email' 
                        placeholder='Enter Your Email' 
                        name='email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <TERipple rippleColor="light">
                    <button
                        type="button"
                        className="add-btn inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow transition duration-150 ease-in-out hover:bg-primary-600 focus:outline-none"
                        onClick={handleSubmit}
                        disabled={!email}
                    >
                        Submit
                    </button>
                </TERipple>

                <span>Remember Password? <Link to='/login'>Login</Link> </span>
                </>
}
            </div>
        </div>
    );
};

export default ForgotPassword;
