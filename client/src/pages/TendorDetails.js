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
import { FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const TendorDetails = () => {
  const params = useParams();
  const [tendor, setTendor] = useState({});
  const [quotation, setQuotation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [user, navigate]);

  const getTendorDetails = async () => {
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
      }
    } catch (error) {
      message.error('Something went wrong');
      setError('Failed to fetch tender details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTendorDetails();
  }, [params?.id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#00bcd4" />
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center mt-10">{error}</div>
    );

  // Sort quotations by rate in descending order
  const sortedQuotations = [...quotation].sort(
    (a, b) =>
      parseFloat(b.rate?.$numberDecimal || b.rate) -
      parseFloat(a.rate?.$numberDecimal || a.rate)
  );

  const getRowClass = (index) => {
    if (index === 0) return 'bg-green-500 text-white';
    if (index === 1) return 'bg-green-400 text-white';
    if (index === 2) return 'bg-green-300 text-white';
    return 'bg-white dark:bg-gray-800';
  };

  const handlePrint = () => {
    navigate(`/print/${params?.id}`)
  };

  const handleShare=async()=>{
    try{
      const {data}=await axios.post(`${host}/tendor/share/${params?.id}`);
      if(data?.success){
        message.success("Result Shared Successfully with Parties");
      }
    }catch(error){
      message.error("Something went wrong");
    }
  }

  return (
    <>
      <Header />
      <main className="py-8 px-4 mx-auto max-w-screen-2xl dark:bg-gray-900">
        <div className="flex justify-end gap-x-2 mb-4">
          <button
            onClick={handleShare}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Share Result
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Print
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tender Details Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Post slides={tendor?.images} tendor={tendor} />
            <div className="mt-6">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                The tender was closed on{' '}
                <span className="font-bold">{FormatDate(tendor?.closesOn)}</span>
              </div>
            </div>
          </div>

          {/* Bidders Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Bidders</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-gray-50 dark:bg-gray-700 rounded-lg">
                <thead>
                  <tr className="text-left bg-gray-100 dark:bg-gray-600">
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">Company Name</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">Email</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">Phone</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">City</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">Color</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300">Rate (Rs.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedQuotations.length > 0 ? (
                    sortedQuotations.map((item, index) => (
                      <tr
                        key={index}
                        className={`${getRowClass(index)} hover:shadow-lg transition duration-150`}
                      >
                        <td className="px-4 py-2 text-sm">{item.companyName}</td>
                        <td className="px-4 py-2 text-sm">{item.email}</td>
                        <td className="px-4 py-2 text-sm">
                          {item.phone}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {item.city}
                        </td>
                        <td className="px-4 py-2 text-sm">{item.color}</td>
                        <td className="px-4 py-2 text-sm">
                          {FormatCurrency(item.rate?.$numberDecimal || item.rate)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-2 text-center text-sm text-gray-500">
                        No bidders found.
                      </td>
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
