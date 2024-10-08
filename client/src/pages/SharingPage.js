import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/SharingPage.css';
import Banner from '../components/Banner';
import { TERipple } from "tw-elements-react";
import Post from '../components/Post';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/host'
import Confirmation from '../components/Confirmation';

const SharingPage = () => {

  const params=useParams()
  const clientId=params.clientId;
  const postId=params.postId;

  const [tendor,setTendor]=useState({})
  const [client,setClient]=useState({});
  const [rate,setRate]=useState(0);
  const [isConfirm,setIsConfirm]=useState(false);


  const getTendorDetail=async()=>{
    try{
      const res=await axios.get(`${host}/tendor/get-tendor/${postId}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      if(res.data.success){
        // console.log(res.data.tendor)
        setTendor(res.data.tendor)
      }
    }catch(error){
      // console.log(error.message);
      message.error('Something went wrong')
    }
  }

  const getClientDetail=async()=>{
    try{
      const res=await axios.get(`${host}/client/getParty/${clientId}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      if(res.data.success){
        // console.log(res.data)
        setClient(res.data.party)

      }
    }catch(error){
      // console.log(error.message)
      message.error('Something went wrong')
    }
  }
  const handleSubmit=async()=>{
    try{
      const res=await axios.post(`${host}/tendor/update-quotation/${clientId}/${postId}`,{rate},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        // console.log(res.data)
        message.success(res.data.message)
      }

    }catch(error){
      // console.log(error.message)
      message.error('Something went wrong')
    }
    setIsConfirm(false)
  }


  useEffect(()=>{
    // console.log('init')
    getTendorDetail();
    getClientDetail();
  
  },[])

  return (
    <>
      <Header />
      <div className='share-container'>
        <Banner />
        <Confirmation onConfirm={handleSubmit} isConfirm={isConfirm} setIsConfirm={setIsConfirm} />
        <Post slides={tendor?.images} tendor={tendor} />
        <div className='shared-post'>
        <div className='rate-container'>
              <span>Enter your rate for the above specified product (excluding GST)</span>
              <div className='input-group'>
              <label className='block text-sm font-medium text-gray-700'>Rate:</label>
              <input
                type='number'
                placeholder='Enter Rate'
                name='rate'
                value={rate}
                onChange={(e)=>setRate(e.target.value)}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
              />
              </div>
              <TERipple rippleColor="light">
              <button
                type="button"
                className="add-btns w-full inline-block rounded bg-primary px-3 py-2 text-white font-medium uppercase shadow-md transition duration-150 ease-in-out hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                onClick={()=>setIsConfirm(true)}
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

export default SharingPage;
