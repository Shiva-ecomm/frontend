import React, { useState } from "react";
import { TEInput, TERipple } from "tw-elements-react";
import {message} from 'antd';
import { Link, useNavigate, } from "react-router-dom";
import host from "../APIRoute/host";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";

const Login=()=> {

  const [email,setEmail]=useState(null);
  const [password,setPassword]=useState(null);
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const handleLogin=async ()=>{
    if(!email || !password){
      message.error('Please provide email or password')
    }
    
    try{
      const res=await axios.post(`${host}/user/login`,{email:email,password:password});
      // console.log(res);
      if(res.data.success){
        // console.log(res.data)
        localStorage.setItem('token',res.data.token);
        message.success(res.data.message);
        navigate('/');
        dispatch(setUser(res.data.user));
      }

    }catch(error){
      // console.log(error.message);
      if(error.response && error.response.data){
        message.error(error.response.data.message || 'An error occured. Please try again');
      }else{
        message.error('An error occured.Please try again. ')
      }
    }
  }

  return (
    <section className="h-full bg-neutral-200 dark:bg-neutral-700">
      <div className="container h-full p-10">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="w-full">
            <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
              <div className="g-0 lg:flex lg:flex-wrap">
                {/* <!-- Left column container--> */}
                <div className="px-4 md:px-0 lg:w-6/12">
                  <div className="md:mx-6 md:p-12">
                    {/* <!--Logo--> */}
                    <div className="text-center">
                      <img
                        className="mx-auto w-48"
                        src="/images/final_logo_png_file-removebg-preview.png"
                        alt="logo"
                      />
                      <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                        We are The Shiva Group
                      </h4>
                    </div>

                    <form>
                      <p className="mb-4">Please login to your account</p>
                      {/* <!--Username input--> */}
                      <TEInput
                        type="text"
                        label="Email"
                        className="mb-4"
                        placeholder="Email"
                        name="email"
                        onChange={(e)=>setEmail(e.target.value)}
                        style={{border:'1px solid ',borderRadius:'5px',padding: '10px 10px 8px'}}
                      ></TEInput>

                      {/* <!--Password input--> */}
                      <TEInput
                        type="password"
                        label="Password"
                        className="mb-4"
                        placeholder="Password"
                        name="password"
                        onChange={(e)=>setPassword(e.target.value)}
                        style={{border:'1px solid ',borderRadius:'5px',padding: '10px 10px 8px'}}

                      ></TEInput>

                      {/* <!--Submit button--> */}
                      <div className="mb-12 pb-1 pt-1 text-center">
                        <TERipple rippleColor="light" className="w-full">
                        
                          <button
                            className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                            type="button"
                            style={{
                              background:
                                "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                            }}
                            onClick={handleLogin}
                          >
                            Log in 
                          </button>
                         
                        </TERipple>

                        {/* <!--Forgot password link--> */}
                        
                      </div>
                      <span onClick={()=>{navigate('/forgot-password')}}>Forgot password? </span>

                      {/* <!--Register button--> */}
                      <div className="flex items-center justify-between pb-6">
                        <p className="mb-0 mr-2">Don't have an account?</p>
                        <TERipple rippleColor="light">
                           <Link to='/register'>
                          <button
                            type="button"
                            className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                          >
                            Register
                          </button></Link>
                        </TERipple>
                      </div>
                    </form>
                  </div>
                </div>

                {/* <!-- Right column container with background and description--> */}
                <div
                  className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none"
                  style={{
                    background:
                      "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                  }}
                >
                  <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                    <h4 className="mb-6 text-xl font-semibold">
                      We are more than just a company
                    </h4>
                    <p className="text-sm">
                    We are the only manufacturer of recycled polyester fibre in Punjab Region and engaged in producing an extensive range of polyester fibre.

                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;