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

const TendorDetails = () => {
  const params = useParams();
  const [tendor, setTendor] = useState({});
  const [quotation, setQuotation] = useState([]);
  const [highRate, setHighRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate=useNavigate()
  const {user}=useSelector((state)=>state.user);

  useEffect(()=>{
    if(!localStorage.getItem('token')){
      navigate('/login')
    }
  },[user,navigate])


  const getTendorDetials = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${host}/tendor/get-tendor/${params?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setTendor(res.data.tendor);
        setQuotation(res.data.quotations);
        highestBid(res.data.quotations);
      }
    } catch (error) {
      // console.error(error.message);
      message.error('Something went wrong');
      setError('Failed to fetch tender details.');
    } finally {
      setLoading(false);
    }
  };

  const highestBid = (quotations) => {
    if (!quotations || quotations.length === 0) return;
    const maxRate = Math.max(
      ...quotations.map(item => parseFloat(item.rate?.$numberDecimal || item.rate))
    );
    setHighRate(maxRate);
  };

  useEffect(() => {
    getTendorDetials();
  }, [params?.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const highestBidders = quotation.filter(item => 
    parseFloat(item.rate?.$numberDecimal || item.rate) === highRate
  );

  const lowerBidders = quotation.filter(item => 
    parseFloat(item.rate?.$numberDecimal || item.rate) < highRate
  );


  return (
    <>
      <Header />
      <main className="py-8 mx-auto ">
        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
          {/* Post Details Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md main-container" >
            <Post slides={tendor?.images} tendor={tendor} />
            <div className="mt-6">
              <div className="text-lg font-semibold">
                <span>The tender was closed on </span>
                <span className="font-bold">{FormatDate(tendor?.closesOn)}</span>
              </div>
              <div className="mt-4 text-base">
                <div className="flex justify-between">
                  <span className="font-medium">Highest Rate:</span>
                  <span className="font-bold">{FormatCurrency(highRate)}</span>
                </div>
                {/* Table for Highest Bidders */}
                <div className="mt-6 overflow-x-auto table-container" style={{ maxHeight: '350px' }}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {highestBidders.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.city}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.rate?.$numberDecimal || item?.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Other Bidders Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Other Bidders</h2>
            <div className="mt-6 overflow-x-auto table-container" style={{ maxHeight: '600px' }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lowerBidders.length > 0 ? (
                    lowerBidders.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.rate?.$numberDecimal || item?.rate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-sm text-gray-500 text-center">No lower bidders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TendorDetails;
