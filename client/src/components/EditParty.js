import React, { useEffect, useState } from 'react';
import '../styles/Post.css'; // Ensure this file contains any additional CSS you need
import { TERipple } from "tw-elements-react";
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/host';

const EditParty = ({isEdit,id,handleClick}) => {

  const[name,setName]=useState('a');
  const[email,setEmail]=useState('a');
  const[phone,setPhone]=useState('a');
  const[address,setAddress]=useState('a');
  const[city,setCity]=useState('a');
  const[state,setState]=useState('a');
  const[country,setCountry]=useState('a');
  const[companyName,setCompanyName]=useState('a');

  const getPartyDetails = async () => {
    try {
      const res = await axios.get(`${host}/client/getParty/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success) {
        // message.success('Data fetched successfully');
        // console.log(res.data.party)
        const party = res.data.party;
        setName(party.name);
        setPhone(party.phone);
        setEmail(party.email);
        setAddress(party.address);
        setCity(party.city);
        setState(party.state);
        setCountry(party.country);
        setCompanyName(party.companyName);
      }
    } catch (error) {
      message.error('Something went wrong');
      // console.log(error.message);
    }
  };
  

  const handleUpdate=async()=>{
    try{
      const res=await axios.post(`${host}/client/updateParty/${id}`,
        {name,phone,email,address,city,state,country,companyName},{
          headers:{
            authorization:`Bearer ${localStorage.getItem('token')}`
          }
        })
        if(res.data.success){
          message.success(res.data.message);
        }

    }catch(error){
      // console.log(error.message);
      message.error('Something went wrong');
    }
  }
  
  const handleClose=()=>{
    setName('')
    setPhone('')
    setEmail('')
    setAddress('')
    setCity('')
    setState('')
    setCountry('')
    setCompanyName('')
    handleClick();
  }

  useEffect(()=>{
    // console.log(id);
    if(isEdit){
      getPartyDetails();
    }
  },[id,isEdit])

  return (
    <>
    {isEdit ? 
    (
      <div className='main-post' >
        <div className='blank-screen'onClick={handleClose}></div>
    <div className='post-container' >

    <div className='container mx-auto ' >
      <h1 className='text-3xl font-bold text-center mb-8 post-header'>
        <span className='text-primary'>Edit Party</span>
      </h1>

      <div className='bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-3xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div className='input-group'>
              <label className='block text-sm font-medium text-gray-700'>Name:</label>
              <input
                type='text'
                placeholder='Enter name'
                value={name}
                name='name'
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
          </div>
          
          <div className='space-y-4'>
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
            <div className='input-group'>
              <label className='block text-sm font-medium text-gray-700'>Company Name:</label>
              <input
                type='text'
                placeholder='Enter Company Name'
                name='companyName'
                value={companyName}
                onChange={(e)=>setCompanyName(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
              />
            </div>

            <TERipple rippleColor="light">
              <button
                type="button"
                className="add-btn w-full inline-block rounded bg-primary px-6 py-3 text-white font-medium uppercase shadow-md transition duration-150 ease-in-out hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                onClick={handleUpdate}
              >
                Update
              </button>
            </TERipple>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    ) : (<></>)}
    
    </>
  );
}

export default EditParty;
