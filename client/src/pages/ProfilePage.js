import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ProfilePage.css';
import { message } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import host from '../APIRoute/host';

const ProfilePage = () => {
  const [user,setUser]=useState({})
  const params=useParams();
  const navigate=useNavigate()

  const fetchUser=async(req,res)=>{
    try{
      const res=await axios.get(`${host}/user/getUser/${params?.id}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        // console.log(res.data)
        setUser(res.data.user)
      }
    }catch(error){
      // console.log(error.message);
      message.error('Something went wrong')
    }
  }

  useEffect(()=>{
    fetchUser();
  },[])
  useEffect(()=>{
    if(!localStorage.getItem('token')){
      navigate('/login')
    }
  },[user,navigate])
  return (
    <>
      <Header />
      <div className='profile-container'>
        <h1 className='title'>User Profile</h1>
        <div className='user-details'>
          <div className='details'>
            <span className='label'>Name:</span>
            <span>{user?.name}</span>
          </div>
          <div className='details'>
            <span className='label'>Phone:</span>
            <span>{user?.phone}</span>
          </div>
          <div className='details'>
            <span className='label'>Email:</span>
            <span>{user?.email}</span>
          </div>
          <div className='details'>
            <span className='label'>User Type:</span>
            <span>{user?.isAdmin ? 'Admin' : 'User'}</span>
          </div>
        </div>

        {/* <div className='password-details'>
          <h2 className='subtitle'>Change Password</h2>
          <div className='details'>
            <label className='label'>Old Password:</label>
            <input type='password' name='old-password' placeholder='Old Password' />
          </div>
          <div className='details'>
            <label className='label'>New Password:</label>
            <input type='password' name='new-password' placeholder='New Password' />
          </div>
          <div className='details'>
            <label className='label'>Confirm New Password:</label>
            <input type='password' name='confirm-new-password' placeholder='Confirm New Password' />
          </div>
          <div className='details'>
            <button type="button" className="update-btn">Update Password</button>
          </div>
        </div> */}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
