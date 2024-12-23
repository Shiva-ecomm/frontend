import React, { useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import host from "../APIRoute/host";

const EditParty = ({ isEdit, id, handleClick }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const getPartyDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${host}/client/getParty/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        const party = res.data.party;
        setName(party.name);
        setPhone(party.phone);
        setEmail(party.email);
        setAddress(party.address);
        setCity(party.city);
        setState(party.state);
        setCountry(party.country);
        setCompanyName(party.companyName);
      }
    } catch (error) {
      message.error("Failed to fetch party details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.post(
        `${host}/client/updateParty/${id}`,
        { name, phone, email, address, city, state, country, companyName },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      message.error("Failed to update party details.");
    }
  };

  const handleClose = () => {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setCompanyName("");
    handleClick();
  };

  useEffect(() => {
    if (isEdit) {
      getPartyDetails();
    }
  }, [id, isEdit]);

  return (
    <>
      {isEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {loading ? (
            <ClipLoader />
          ) : (
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8 dark:bg-gray-900">
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 dark:text-white">
                Edit Party
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">
                      Name:
                    </label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full mt-1  dark:text-white px-4 py-2 border rounded-md focus:ring focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block dark:text-white text-sm font-medium text-gray-700">
                      Email:
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full dark:text-white mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block dark:text-white text-sm font-medium text-gray-700">
                      Phone:
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full dark:text-white mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block dark:text-white text-sm font-medium text-gray-700">
                      Address:
                    </label>
                    <textarea
                      placeholder="Enter address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full dark:text-white mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block dark:text-white text-sm font-medium text-gray-700">
                      City:
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full dark:text-white mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block dark:text-white text-sm font-medium text-gray-700">
                      State:
                    </label>
                    <input
                      type="text"
                      placeholder="Enter state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full dark:text-white mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block dark:text-white text-sm font-medium text-gray-700">
                      Country:
                    </label>
                    <input
                      type="text"
                      placeholder="Enter country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full dark:text-white mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block dark:text-white text-sm font-medium text-gray-700">
                      Company Name:
                    </label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full dark:text-white mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="px-6 py-2 bg-red-900 text-white rounded-md shadow-md hover:bg-primary-600"
                  onClick={handleUpdate}
                >
                  Update
                </button>
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md shadow-md hover:bg-gray-300"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EditParty;
