import React, { useEffect,useState } from 'react';
import Header from '../components/Header';
import '../styles/Home.css';
import { TERipple } from "tw-elements-react";
import CardDefault from '../components/CardDefault';
import Footer from '../components/Footer';
import { Link,useNavigate } from 'react-router-dom';
import { message } from 'antd';
import host from '../APIRoute/host';
import axios from 'axios';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';

const Home = () => {
  const [tendors,setTendors]=useState([]);
  const {user}=useSelector((state)=>state.user)
  const navigate=useNavigate()

  const getTendors=async()=>{
    try{
      const res=await axios.get(`${host}/tendor/get-tendors`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        // message.success(res.data.success)
        setTendors(res.data.tendors)
        // console.log(res.data)
      }
    }catch(error){
      // console.error(error.message);
      // message.error('Something went wrong')
      
    }
  }




  const currentDate=Date.now();

  useEffect(()=>{
    if(!localStorage.getItem('token')){
      navigate('/login')
    }
  },[user,navigate])

  useEffect(()=>{
    getTendors();
  },[CardDefault])

  return (
    <div>
      {/* <Post/> */}
      <Header />
      
      <div className='m-20 mt-5'>
        {user?.isAdmin && 
        <div className='tendor'>
          <TERipple rippleColor="light">
            <button
              type="button"
              className="add-btns inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow transition duration-150 ease-in-out hover:bg-primary-600 focus:outline-none"
              style={{padding:'20px 45px'}}
            >
              <Link to='/add-tendor' style={{fontSize:'2rem'}} >
              +</Link>
            </button>
          </TERipple>
          <p className='header' style={{background:'none',color:'black',fontSize:'1.5rem'}} >Add New Tendors</p>
        </div>}

        <div className='all-tendors shared-post' style={{maxWidth:'100%'}}>
          <div className='card'>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-2 pb-4 relative tendor-header">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Ongoing Tendors</span>
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
        </h1>           
    <div className="tendor-container">
      {tendors.length===0 ? (<div style={{display:'flex',justifyContent:'center',alignItems:'center' ,width:'100%'}}>
          <span style={{fontSize:'1.5rem'}}>No Tendor to Show</span>
          </div>) :
    tendors.map((card, index) => {
        const closesOnDate = new Date(card?.closesOn);
        return closesOnDate >= currentDate && card?.active ? (
          <CardDefault
            key={index}
            card={card}
            refreshTendors={getTendors}
            active={true}

          />
        ) : null ;
      })}
            </div>
          </div>
          <div className='card'>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-2 pb-4 relative tendor-header">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Completed Tendors</span>
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
    </h1>  
                <div className="tendor-container">
                  {tendors.length===0 ? (<div style={{display:'flex',justifyContent:'center',alignItems:'center' ,width:'100%'}}>
          <span style={{fontSize:'1.5rem'}}>No Tendor to Show</span>
          </div>):
                tendors.map((card, index) => {
        const closesOnDate = new Date(card?.closesOn);
        return closesOnDate < currentDate && card?.active===false ? (
          <CardDefault
            key={index}
            card={card}
            refreshTendors={getTendors}
            active={user?.isAdmin ? false : true}
          />
        ) : null
      })}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>

  );
};

export default Home;
