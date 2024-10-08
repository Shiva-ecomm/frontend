import { message } from 'antd';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import host from '../APIRoute/host';
import FormatDate from '../helpers/FormatDate';
import '../styles/CardDefault.css';
import { useSelector } from 'react-redux';

const CardDefault = ({ card, refreshTendors, active }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleClick = (id) => {
    if (active) {
      navigate(`/tendorInfo/${id}`);
    } else {
      navigate(`/tendorDetails/${id}`);
    }
  };

  const closeTendor = async () => {
    try {
      const res = await axios.post(`${host}/tendor/change-state/${card?._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success) {
        message.success('Closed tendor successfully');
        refreshTendors();
      }
    } catch (error) {
      // console.log(error.message);
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    // Any necessary effect logic can go here
  }, [closeTendor]);

  return (
    <div className="rounded overflow-hidden shadow-lg"
      style={{ width: '95%', height: 'fit-content', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2" onClick={() => handleClick(card?._id)}>{card?.title}</div>
        <p className="text-gray-700 text-base" onClick={() => handleClick(card?._id)}>
          {card?.description}
        </p>
      </div>
      <div className="px-4 pt-4 pb-2" style={{display:'flex'}}>
        <span
          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          onClick={() => handleClick(card?._id)}
        >
          Quantity: {card?.qty?.$numberDecimal || card?.qty}
        </span>

        <span
          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          onClick={() => handleClick(card?._id)}
        >
          Created On: {FormatDate(card?.createdOn)}
        </span>

        <span
          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          onClick={() => handleClick(card?._id)}
        >
          Closes On: {FormatDate(card?.closesOn)}
        </span>

        {user?.isAdmin && (
          <div className="button-section">
            {card?.active ? (
              <button
                type="button"
                style={{ fontSize: '0.7rem', width: '120px', height: '40px' }}
                className="add-btn inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_-4px_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                onClick={closeTendor}
              >
                Close Tendor
              </button>
            ) : (
              <button
                type="button"
                style={{ fontSize: '0.7rem', width: '120px', height: '40px' }}
                className="add-btn inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                onClick={() => handleClick(card?._id)}
              >
                See Details
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDefault;
