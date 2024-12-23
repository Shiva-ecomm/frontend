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
import { FaPhone, FaMapMarkerAlt, FaRegEnvelope } from 'react-icons/fa';

const TendorDetails = () => {
  const params = useParams();
  const [tendor, setTendor] = useState({});
  const [quotation, setQuotation] = useState([]);
  const [highRate, setHighRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [user, navigate]);

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
      message.error('Something went wrong');
      setError('Failed to fetch tender details.');
    } finally {
      setLoading(false);
    }
  };

  const highestBid = (quotations) => {
    if (!quotations || quotations.length === 0) return;
    const maxRate = Math.max(
      ...quotations.map((item) => parseFloat(item.rate?.$numberDecimal || item.rate))
    );
    setHighRate(maxRate);
  };

  useEffect(() => {
    getTendorDetials();
  }, [params?.id]);

  if (loading) 
    return <div className="flex justify-center items-center h-screen"><ClipLoader color="#00bcd4" /></div>;
  if (error) 
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  const highestBidders = quotation.filter(
    (item) => parseFloat(item.rate?.$numberDecimal || item.rate) === highRate
  );

  const lowerBidders = quotation.filter(
    (item) => parseFloat(item.rate?.$numberDecimal || item.rate) < highRate
  );

  return (
    <>
      <Header />
      <main className="py-8 px-4 mx-auto max-w-screen-2xl dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Post Details Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <Post slides={tendor?.images} tendor={tendor} />
            <div className="mt-6">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                <span>The tender was closed on </span>
                <span className="font-bold">{FormatDate(tendor?.closesOn)}</span>
              </div>
              <div className="mt-4 text-base">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-300">Highest Rate:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100">{FormatCurrency(highRate)}</span>
                </div>
                {/* Table for Highest Bidders */}
                <div className="mt-6 overflow-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {highestBidders.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{item?.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{item?.email}</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">
                            <FaPhone className="inline mr-2 text-blue-500" />
                            {item?.phone}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">
                            <FaMapMarkerAlt className="inline mr-2 text-green-500" />
                            {item?.city}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{item?.color}</td>
                          <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{item?.rate?.$numberDecimal || item?.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Other Bidders Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Other Bidders</h2>
            <div className="mt-6 overflow-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {lowerBidders.length > 0 ? (
                    lowerBidders.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{item?.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{item?.email}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">
                          <FaPhone className="inline mr-2 text-blue-500" />
                          {item?.phone}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">
                          <FaMapMarkerAlt className="inline mr-2 text-green-500" />
                          {item?.city}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{item?.color}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-200">{item?.rate?.$numberDecimal || item?.rate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-2 text-sm text-gray-500 text-center">No lower bidders found</td>
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