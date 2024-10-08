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
import '../styles/TendorDetails.css';
import { useSelector } from 'react-redux';

const TendorInfo = () => {
  const { id } = useParams();
  const [tendor, setTendor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate=useNavigate()
  const {user}=useSelector((state)=>state.user)

  const getTendorDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${host}/tendor/get-tendor/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (data.success) {
        setTendor(data.tendor);
        // setQuotation(data.quotations);
        // highestBid(data.quotations);
      }
    } catch (err) {
      // console.error(err.message);
      message.error('Something went wrong');
      setError('Failed to fetch tender details.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    if(!localStorage.getItem('token')){
      navigate('/login')
    }
  },[user,navigate])
  

  useEffect(() => {
    getTendorDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

 

  return (
    <>
      <Header />
      <main className="py-8 mx-auto">
        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md main-container">
            <Post slides={tendor?.images} tendor={tendor} />
            <div className="mt-6">
              <div className="text-lg font-semibold">
                  <span>The tender will close on </span>
                
                <span className="font-bold">{FormatDate(tendor?.closesOn)}</span>
              </div>
              <div className="mt-4 text-base">
              
              
              </div>
            </div>
          </div>

        
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TendorInfo;
