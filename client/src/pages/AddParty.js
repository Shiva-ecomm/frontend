import React, { useState,useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { TERipple } from "tw-elements-react";
import '../styles/AddParty.css';
import {message} from 'antd';
import axios from 'axios'
import host from '../APIRoute/host';
import Confirmation from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const  AddParty = () => {
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [phone,setPhone]=useState('')
  const [address,setAddress]=useState('')
  const [city,setCity]=useState('')
  const [country,setCountry]=useState('')
  const [state,setState]=useState('')
  const [companyName,setCompanyName]=useState('');
  const [isConfirm,setIsConfirm]=useState(false);
  const navigate=useNavigate();
  const {user}=useSelector((state)=>state.user)

  const companyDetails={
    name,email,phone,address,city,state,country,companyName
  }

  
const handleSubmit = async () => {
  try {
    // Prepare the data to be sent in the request body
    const data = {
      name,
      email,
      phone,
      address,
      city,
      state,
      country,
      companyName,
    };

    // Make the POST request with headers and data
    const res = await axios.post(`${host}/client/addParty`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    // Handle the response
    if (res.data.success) {
      message.success(res.data.message);
      // Clear form fields
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setState('');
      setCountry('');
      setCompanyName('');
    } else {
      message.error(res.data.message || 'Failed to add party');
    }

  } catch (error) {
    // console.error(error.message);
    message.error('An error occurred while adding the party');
  }
  setIsConfirm(false);
};

useEffect(()=>{
  if(!localStorage.getItem('token')){
    navigate('/login')
  }
},[user,navigate])

  return (
    <>
      <Header />
      <Confirmation isConfirm={isConfirm} onConfirm={handleSubmit} setIsConfirm={setIsConfirm} />
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-center mb-6'>
          <span className='text-primary'>Add Party</span>
        </h1>

        <div className='bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto'>
          <div className='space-y-4'>
          <div className='input-group'>
              <label className='block text-sm font-medium text-gray-700'>Company Name:</label>
              <input
                type='text'
                placeholder='Enter country'
                name='companyName'
                value={companyName}
                onChange={(e)=>setCompanyName(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
              />
            </div>
            <div className='input-group'>
              <label className='block text-sm font-medium text-gray-700'> Contact Person Name:</label>
              <input
                type='text'
                placeholder='Enter name'
                name='name'
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
              />
            </div>
            <div className='input-group'>
              <label className='block text-sm font-medium text-gray-700'>Email:</label>
              <input
                type='email'
                placeholder='Enter email'
                name='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
              />
            </div>
            <div className='input-group'>
              <label className='block text-sm font-medium text-gray-700'>Phone no:</label>
              <input
                type='tel'
                placeholder='Enter phone no'
                name='phone'
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
              />
            </div>
            <div className='input-group'>
              <label className='block text-sm font-medium text-gray-700'>Address:</label>
              <textarea
                placeholder='Enter address'
                name='address'
                value={address}
                onChange={(e)=>setAddress(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
              ></textarea>
            </div>
            <div className='input-group'>
              <label className='block text-sm font-medium text-gray-700'>City:</label>
              <input
                type='text'
                placeholder='Enter city'
                name='city'
                value={city}
                onChange={(e)=>setCity(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
              />
            </div>
            <div className='input-group'>
              <label className='block text-sm font-medium text-gray-700'>State:</label>
              <input
                type='text'
                placeholder='Enter state'
                name='state'
                value={state}
                onChange={(e)=>setState(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
              />
            </div>
            <div className='input-group'>
              <label className='block text-sm font-medium text-gray-700'>Country:</label>
              <input
                type='text'
                placeholder='Enter country'
                name='country'
                value={country}
                onChange={(e)=>setCountry(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
              />
            </div>
            
            
            <TERipple rippleColor="light">
              <button
                type="button"
                onClick={()=>setIsConfirm(true)}
                className="add-btns w-full inline-block rounded bg-primary px-3 py-2 text-white font-medium uppercase shadow-md transition duration-150 ease-in-out hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                Submit
              </button>
            </TERipple>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AddParty;
