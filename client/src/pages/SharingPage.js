import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import { TERipple } from "tw-elements-react";
import Post from '../components/Post';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/host';
import Confirmation from '../components/Confirmation';
import { FaCheckCircle } from 'react-icons/fa';

const SharingPage = () => {
  const params = useParams();
  const clientId = params.clientId;
  const postId = params.postId;

  const [tendor, setTendor] = useState({});
  const [client, setClient] = useState({});
  const [rate, setRate] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [isConfirm, setIsConfirm] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // New state for button

  const getTendorDetail = async () => {
    try {
      const res = await axios.get(`${host}/tendor/get-tendor/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setTendor(res.data.tendor);
        console.log(res.data.tendor);
        
      }
    } catch (error) {
      message.error('Something went wrong');
    }
  };

  const getClientDetail = async () => {
    try {
      const res = await axios.get(`${host}/client/getParty/${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setClient(res.data.party);
      }
    } catch (error) {
      message.error('Something went wrong');
    }
  };

  const handleSubmit = async () => {
    if (rate === 0) {
      message.warning("Please enter valid rate");
      return;
    }

    if (selectedColor === "") {
      message.warning("Please select a color");
      return;
    }

    setIsButtonDisabled(true); // Disable button on submission
    try {
      const res = await axios.post(
        `${host}/tendor/update-quotation/${clientId}/${postId}`,
        { rate, color: selectedColor },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      message.error('Something went wrong');
    }
    setIsConfirm(false);
  };

  useEffect(() => {
    getTendorDetail();
    getClientDetail();
  }, []);

  const handleRateChange = (e) => {
    setRate(e.target.value);
    setIsButtonDisabled(false); // Enable button when rate changes
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    setIsButtonDisabled(false); // Enable button when color changes
  };

  return (
    <>
      <Header />
      <div className='dark:bg-gray-900 bg-white dark:text-white'>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Banner closesOn={tendor?.closesOn} />
          <Confirmation
            onConfirm={handleSubmit}
            isConfirm={isConfirm}
            setIsConfirm={setIsConfirm}
          />
          <Post slides={tendor?.images} tendor={tendor} />

          <div className="shared-post mt-8">
            <div className="rate-container bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Enter your rate for the above specified product (excluding GST)
              </h3>
              <div className="input-group mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rate:
                </label>
                <input
                  type="number"
                  placeholder="Enter Rate"
                  name="rate"
                  value={rate}
                  onChange={handleRateChange} // Update handler
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                />
              </div>

              <div className="input-group mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Color:
                </label>
                <select
                  value={selectedColor}
                  onChange={handleColorChange} // Update handler
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                >
                  <option value="" disabled>Select a color</option>
                  {tendor?.color?.map((color, index) => (
                    <option key={index} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className={`mt-4 w-full inline-block rounded bg-[rebeccapurple] px-4 py-2 text-white font-medium uppercase shadow-md transition duration-150 ease-in-out 
                  ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 dark:hover:bg-yellow-500'}`}
                onClick={() => setIsConfirm(true)}
                disabled={isButtonDisabled} // Disable button based on state
              >
                <FaCheckCircle className="inline-block mr-2" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SharingPage;
