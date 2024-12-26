import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import FormatDate from '../helpers/FormatDate';
import FormatCurrency from '../helpers/FormatCurrency';
import host from '../APIRoute/host';

const PrintTendorDetails = () => {
  const { id } = useParams();
  const [tendor, setTendor] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTenderDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${host}/tendor/get-tendor/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
            console.log(response.data)
          setTendor(response.data.tendor);
          setQuotations(response.data.quotations);
        } else {
          throw new Error('Failed to fetch tender details.');
        }
      } catch (error) {
        message.error('Something went wrong');
        setError(error.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchTenderDetails();
  }, [id]);

  // Sort quotations by rate in descending order
  const sortedQuotations = [...quotations].sort((a, b) =>
    parseFloat(b.rate?.$numberDecimal || b.rate) - parseFloat(a.rate?.$numberDecimal || a.rate)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-8 bg-white text-gray-800">
      <h1 className="text-2xl font-bold text-center mb-8">Tender Details</h1>

      {/* Tender Information */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Tender Information</h2>
        <p>
          <strong>Title:</strong> {tendor?.title || 'N/A'}
        </p>
        <p>
          <strong>Description:</strong> {tendor?.description || 'N/A'}
        </p>
        <p>
  <strong>Color:</strong>{' '}
  {tendor?.color?.length > 0
    ? tendor.color.map((item, index) => (
        <span key={index}>
          {item}
          {index < tendor.color.length - 1 ? ', ' : ''}
        </span>
      ))
    : 'N/A'}
</p>

        <p>
          <strong>Closes On:</strong> {FormatDate(tendor?.closesOn) || 'N/A'}
        </p>
      </div>

      {/* Bidders Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Bidders</h2>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">City</th>
              <th className="border px-4 py-2">Color</th>
              <th className="border px-4 py-2">Rate</th>
            </tr>
          </thead>
          <tbody>
            {sortedQuotations.length > 0 ? (
              sortedQuotations.map((item, index) => (
                <tr
                  key={index}
                  className={index < 3 ? 'bg-green-100' : 'bg-white'}
                >
                  <td className="border px-4 py-2">{item.companyName || 'N/A'}</td>
                  <td className="border px-4 py-2">{item.email || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {item.phone || 'N/A'}
                  </td>
                  <td className="border px-4 py-2">
                    {item.city || 'N/A'}
                  </td>
                  <td className="border px-4 py-2">{item.color || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {FormatCurrency(item.rate?.$numberDecimal || item.rate) || 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No bidders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <button
          onClick={() => window.print()}
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default PrintTendorDetails;
