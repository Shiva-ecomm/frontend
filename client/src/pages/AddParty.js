import React, { useState,useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaCity, FaPhone, FaUserAlt, FaEnvelope, FaMapMarkedAlt, FaBuilding } from 'react-icons/fa';
import { MdOutlineLocationCity, MdOutlinePlace } from 'react-icons/md';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import {message} from 'antd';
import axios from 'axios'
import host from '../APIRoute/host';
import Confirmation from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import cities from '../dataset/in.json';

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
  const [darkMode, setDarkMode] = React.useState(false);
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

const handleChange = (city) => {
  setCity(city); // Update city
  const selectedState = cities.find((item) => item.city === city); // Find the first matching city
  
  if (selectedState) {
    setState(selectedState.admin_name || ''); // Update state (fallback to empty string if undefined)
    setCountry(selectedState.country || ''); // Update country (fallback to empty string if undefined)
  } else {
    setState(''); // Reset state if no match
    setCountry(''); // Reset country if no match
  }
};


useEffect(()=>{
  if(!localStorage.getItem('token')){
    navigate('/login')
  }
},[user,navigate])



  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
  <Confirmation isConfirm={isConfirm} onConfirm={handleSubmit} setIsConfirm={setIsConfirm} />

  <Header />

  <div className='dark:bg-gray-900 bg-white'>
  <div className="container mx-auto px-4 py-8  ">
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
      <form className="space-y-6">
        <div className="input-group flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <FaBuilding className="text-primary" />
          <input
            type="text"
            placeholder="Company Name"
            name="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div className="input-group flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <FaUserAlt className="text-primary" />
          <input
            type="text"
            placeholder="Contact Person Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div className="input-group flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <FaEnvelope className="text-primary" />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div className="input-group flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <FaPhone className="text-primary" />
          <input
            type="tel"
            placeholder="Phone Number"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div className="input-group flex flex-col sm:flex-row items-start gap-2">
          <FaMapMarkedAlt className="text-primary mt-2 sm:mt-0" />
          <textarea
            placeholder="Address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
          ></textarea>
        </div>
        <div className="input-group flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <MdOutlineLocationCity className="text-primary" />
          
          <select
            value={city} // Ensure the selected value is updated
            onChange={(e) => handleChange(e.target.value)} // Pass the selected city value
            className="w-full px-3 py-2 dark:text-white dark:bg-gray-800 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="" disabled>
              Select a City
            </option>
            {cities &&
              cities.map((item) => (
                <option key={item.city} value={item.city} className='dark:text-white'>
                  {item.city}
                </option>
              ))}
          </select>

        </div>
        <div className="input-group flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <MdOutlinePlace className="text-primary" />
          <input
            type="text"
            placeholder="State"
            name="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div className="input-group flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <FaCity className="text-primary" />
          <input
            type="text"
            placeholder="Country"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsConfirm(true)}
          className="w-full bg-[rebeccapurple] text-white px-3 py-2 rounded-md uppercase font-semibold shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
  </div>

  <Footer />
</div>

  );
}

export default AddParty;
