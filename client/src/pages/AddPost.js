import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/host';
import { useSelector } from 'react-redux';
import Confirmation from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { FaCheck, FaTimes } from 'react-icons/fa';

const AddPost = () => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [qty, setQty] = useState('');
  const [descr, setDescr] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [colors, setColors] = useState([]);
  const [party, setParty] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState();
  const [search, setSearch] = useState('');
  const [filterParties, setFilteredParties] = useState([]);
  const [selectedParties, setSelectedParties] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [isConfirm, setIsConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length + files.length > 10) {
      alert("You can only upload up to 10 images.");
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  // Remove a file from the list
  const handleRemoveFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const addColor = () => {
    if (colorInput && !colors.includes(colorInput)) {
      setColors([...colors, colorInput]);
      setColorInput('');
    }
  };

  const removeColor = (colorToRemove) => {
    setColors(colors.filter(color => color !== colorToRemove));
  };

  const handleSubmit = async () => {
    setIsConfirm(false);
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('title', title);
      formData.append('descr', descr);
      formData.append('qty', qty);
      formData.append('colors', JSON.stringify(colors));
      formData.append('id', user?._id);
      formData.append('name', user?.name);
      const validPartyIds = selectedParties.map(party => party._id);
      formData.append('validParty', JSON.stringify(validPartyIds));

      const res = await axios.post(`${host}/tendor/upload-images`, formData, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.success) {
        message.success('A new Tendor is opened. It will close exactly after 48 hours');
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
    setLoading(false);
  };

  const getAllParty = async () => {
    try {
      const res = await axios.get(`${host}/client/getParties`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success) {
        setParty(res.data.parties);
        setFilteredParties(res.data.parties);
      }
    } catch (error) {
      console.log(error.message);
      message.error('Something went wrong');
    }
  };

  const filterParty = () => {
    const lowerCaseSearch = search.toLowerCase();
    const filtered = party.filter(item => {
      return (
        (item.name?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.country?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.email?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.city?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.state?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.companyName?.toLowerCase() || '').includes(lowerCaseSearch)
      );
    });

    setFilteredParties(filtered);
  };

  useEffect(() => {
    filterParty();
  }, [search]);

  const handleClick = (item) => {
    setSelectedParties((prevParties) => {
      const exists = prevParties.some((party) => party._id === item._id);
      if (!exists) {
        return [...prevParties, item];
      }
      return prevParties;
    });
  };

  const handleRemoveClick = (id) => {
    setSelectedParties((items) => items.filter((item) => item?._id !== id));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedParties(filterParties);
    } else {
      setSelectedParties([]);
    }
    setSelectAll(!selectAll);
  };

  const isValid = title && qty && descr && colors.length > 0 && selectedParties.length > 0;

  useEffect(() => {
    getAllParty();
  }, [isEdit]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
<>
  <Header />
  <Confirmation
    isConfirm={isConfirm}
    setIsConfirm={setIsConfirm}
    onConfirm={handleSubmit}
  />
  {loading ? (
    <ClipLoader />
  ) : (
    <div className='dark:bg-gray-900'>
      <div className="max-w-7xl mx-auto px-4 py-6 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-black mb-6 pb-4 dark:text-white">Add Tender</h1>

      <div className="bg-white text-black shadow-lg rounded-lg p-6 dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="space-y-6">
          {/* Title and Quantity Inputs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Title:</label>
              <input
                type="text"
                placeholder="Enter title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Quantity:</label>
              <input
                type="text"
                placeholder="Enter quantity (e.g 100 kg)"
                name="qty"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Description:</label>
            <textarea
              placeholder="Enter description"
              name="descr"
              value={descr}
              onChange={(e) => setDescr(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Color Input and List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Color:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter color (e.g Red)"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={addColor}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap mt-4 gap-2 dark:text-white">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full"
                >
                  <span>{color}</span>
                  <button
                    onClick={() => removeColor(color)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Upload Images:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm file:border file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <div className="flex flex-wrap mt-4">
              {files.map((file, index) => (
                <div key={index} className="relative mr-2 mb-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview ${index}`}
                    className="w-16 h-16 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    onClick={() => handleRemoveFile(file)}
                    className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Search Parties and Select All */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Search Parties:</label>
              <input
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSelectAll}
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none"
              >
                {selectAll ? 'Select All' : 'Remove All'}
              </button>
            </div>
          </div>

          {/* Party List Table */}
          <div className="overflow-x-auto max-h-80 mt-6">
            <table className="min-w-full bg-white text-gray-700 border rounded-md shadow-md dark:bg-gray-900">
              <thead className="bg-gray-100 dark:text-white dark:bg-gray-600">
                <tr>
                  <th className="px-6 py-4 dark:text-white">Select</th>
                  <th className="px-6 py-4 dark:text-white">Company Name</th>
                  <th className="px-6 py-4 dark:text-white">Person Name</th>
                  <th className="px-6 py-4 dark:text-white">Email</th>
                  <th className="px-6 py-4 dark:text-white">Mobile</th>
                  <th className="px-6 py-4 dark:text-white">City</th>
                </tr>
              </thead>
              <tbody>
                {filterParties.map((item) => (
                  <tr
                    key={item?._id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleClick(item)}
                  >
                    <td className="px-6 py-4">
                      <FaCheck className="text-green-500" />
                    </td>
                    <td className="px-6 py-4 dark:text-white">{item?.companyName}</td>
                    <td className="px-6 py-4 dark:text-white">{item?.name}</td>
                    <td className="px-6 py-4 dark:text-white">{item?.email}</td>
                    <td className="px-6 py-4 dark:text-white">{item?.phone}</td>
                    <td className="px-6 py-4 dark:text-white">{item?.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Selected Parties Table */}
          {selectedParties.length > 0 && (
            <div className="overflow-x-auto max-h-80  mt-6">
              <h2 className="text-lg font-bold dark:text-white">Selected Parties:</h2>
              <table className="min-w-full bg-white text-gray-700 border rounded-md shadow-md mt-4 dark:bg-gray-900 rounded-lg shadow-lg">
                <thead className="bg-gray-100 dark:bg-gray-600">
                  <tr>
                    <th className="px-6 py-4 dark:text-white">Remove</th>
                    <th className="px-6 py-4 dark:text-white">Company Name</th>
                    <th className="px-6 py-4 dark:text-white">Person Name</th>
                    <th className="px-6 py-4 dark:text-white">Email</th>
                    <th className="px-6 py-4 dark:text-white">Mobile</th>
                    <th className="px-6 py-4 dark:text-white">City</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedParties.map((item) => (
                    <tr
                      key={item?._id}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleRemoveClick(item._id)}
                    >
                      <td className="px-6 py-4">
                        <FaTimes className="text-red-500" />
                      </td>
                      <td className="px-6 py-4 dark:text-white">{item?.companyName}</td>
                      <td className="px-6 py-4 dark:text-white ">{item?.name}</td>
                      <td className="px-6 py-4 dark:text-white">{item?.email}</td>
                      <td className="px-6 py-4 dark:text-white">{item?.phone}</td>
                      <td className="px-6 py-4 dark:text-white">{item?.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-[rebeccapurple] text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          <span>Submit</span>
        </button>

        </div>
      </div>
    </div>
    </div>
  )}
  <Footer />
</>
  )}

  export default AddPost;
