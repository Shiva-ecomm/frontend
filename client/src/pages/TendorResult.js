import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Post from '../components/Post';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/host';
import FormatDate from '../helpers/FormatDate';
import FormatCurrency from '../helpers/FormatCurrency';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { FaCalendarAlt } from 'react-icons/fa'; // Icon for calendar

const TendorResult = () => {
  const params= useParams();
  const [tendor, setTendor] = useState({});
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const getTendorDetails = async () => {
    console.log("get tendor")
    setLoading(true);
    try {
      console.log("init")

      const { data } = await axios.get(`${host}/tendor/get-tendor/${params?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(data)
      if (data.success) {
        setTendor(data.tendor);
        highestRate(data.tendor?.quotation);
        
      }
    } catch (err) {
      message.error('Something went wrong');
      setError('Failed to fetch tender details.');
    } finally {
      setLoading(false);
    }
  };

  const highestRate=(quotation)=>{
    let highRate=0;
    for(let item of quotation){
        if(item?.rate>highRate){
            highRate=item?.rate;
        }
    }
    setRate(highRate);
  }


  useEffect(() => {
    getTendorDetails();
  }, [params?.id]);

  if (loading) return <div className="flex justify-center"><ClipLoader /></div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="py-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md main-container">
            <Post slides={tendor?.images} tendor={tendor} />
            <div className="mt-6">
              <div className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                <FaCalendarAlt className="text-blue-500 dark:text-blue-400 mr-2" />
                <span>The tender was closed on </span>
                <span className="font-bold ml-2">{FormatDate(tendor?.closesOn)}</span>
              </div>
              <div className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                <span>The Highest Bid is </span>
                <span className="font-bold ml-2">{FormatCurrency(rate)}</span>
              </div>
              <div className="mt-4 text-base text-gray-700 dark:text-gray-300">
                {/* Add more information here if needed */}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TendorResult;
