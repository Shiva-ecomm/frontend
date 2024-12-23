import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineCloseCircle, AiOutlineInfoCircle } from "react-icons/ai";
import { BsCalendarEvent, BsBoxSeam } from "react-icons/bs";
import { message } from "antd";
import axios from "axios";
import host from "../APIRoute/host";
import FormatDate from "../helpers/FormatDate";

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
      const res = await axios.post(
        `${host}/tendor/change-state/${card?._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success("Tender closed successfully.");
        refreshTendors();
      }
    } catch (error) {
      message.error("Something went wrong.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out p-4">
      {/* Title */}
      <div
        className="cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 hover:underline"
        onClick={() => handleClick(card?._id)}
      >
        {card?.title}
      </div>

      {/* Description */}
      <p
        className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 cursor-pointer"
        onClick={() => handleClick(card?._id)}
      >
        {card?.description}
      </p>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-400">
          <BsBoxSeam className="mr-2 text-blue-500" />
          Quantity: {card?.qty?.$numberDecimal || card?.qty}
        </div>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-400">
          <BsCalendarEvent className="mr-2 text-green-500" />
          Created On: {FormatDate(card?.createdOn)}
        </div>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-400">
          <BsCalendarEvent className="mr-2 text-red-500" />
          Closes On: {FormatDate(card?.closesOn)}
        </div>
      </div>

      {/* Admin Controls */}
      {user?.isAdmin && (
        <div className="mt-4 flex justify-between items-center">
          {card?.active ? (
            <button
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 focus:ring focus:ring-red-500 focus:ring-opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
              onClick={closeTendor}
            >
              <AiOutlineCloseCircle />
              Close Tender
            </button>
          ) : (
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              onClick={() => handleClick(card?._id)}
            >
              <AiOutlineInfoCircle />
              See Details
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CardDefault;
