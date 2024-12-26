import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EditParty from '../components/EditParty';
import axios from 'axios';
import host from '../APIRoute/host';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ManageParty = () => {
  const [party, setParty] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState();
  const [search, setSearch] = useState('');
  const [filterParties, setFilteredParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const [close, setClose] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const navigate = useNavigate();

  const getAllParty = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${host}/client/getParties`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setParty(res.data.parties);
        setFilteredParties(res.data.parties);
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || 'An error occurred. Please try again');
      } else {
        message.error('An error occurred. Please try again.');
      }
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

  const handleClick = () => {
    setIsEdit(!isEdit);
  };

  const handleClose = () => {
    setClose(!close);
    setIsEdit(!isEdit);
  };

  const handleDelete = async (id) => {
    setIsConfirm(true);
    try {
      const res = await axios.delete(`${host}/client/deleteParty/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        message.success('Deleted successfully');
      }
    } catch (error) {
      message.error('Something went wrong');
    }
    setIsConfirm(false);
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    getAllParty();
  }, [close]);

  return (
    <>
  <EditParty id={id} isEdit={isEdit} handleClick={handleClose} />
  
  {/* Confirm Delete Modal */}
  {isConfirm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-lg mb-4 text-gray-900 dark:text-gray-200">Are you sure you want to delete this party?</p>
        <div className="flex justify-end gap-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={() => handleDelete(id)}
          >
            Confirm
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={() => setIsConfirm(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}

  <Header />
  <div className='dark:bg-gray-900 bg-white'>
  <div className="main-container container mx-auto px-4 py-8 dark:bg-gray-900">
    <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:bg-gray-900 dark:text-white">
      <span className="text-primary dark:text-white">Manage Party</span>
    </h1>

    {loading ? (
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      >
        <span className="!absolute dark:text-white !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    ) : (
      <div className="shared-post">
        <div className="mb-3 xl:w-96">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <input
              type="search"
              className="relative dark:text-white m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-2 text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
              placeholder="Search"
              aria-label="Search"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col table-container">
  <div className="inline-block min-w-full py-2 sm:px-4 lg:px-6">
    {/* Add a fixed height to the container and enable vertical scrolling */}
    <div className="overflow-y-auto max-h-[400px] border border-gray-300 rounded-md">
      <table className="min-w-full text-left text-sm font-light table-auto dark:text-white">
        <thead className="border-b font-medium dark:border-neutral-500">
          <tr>
            <th className="px-2 py-2 text-gray-900 dark:text-white">Company Name</th>
            <th className="px-2 py-2 text-gray-900 dark:text-white">Person Name</th>
            <th className="px-2 py-2 text-gray-900 dark:text-white">Email</th>
            <th className="px-2 py-2 text-gray-900 dark:text-white">Mobile</th>
            <th className="px-2 py-2 text-gray-900 dark:text-white">City</th>
            <th className="px-2 py-2 text-gray-900 dark:text-white">Edit</th>
            <th className="px-2 py-2 text-gray-900 dark:text-white">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filterParties?.map((item) => (
            <tr
              key={item?._id}
              className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
            >
              <td className="whitespace-nowrap px-2 py-2 text-ellipsis overflow-hidden">{item?.companyName}</td>
              <td className="whitespace-nowrap px-2 py-2 text-ellipsis overflow-hidden">{item?.name}</td>
              <td className="whitespace-nowrap px-2 py-2 text-ellipsis overflow-hidden">{item?.email}</td>
              <td className="whitespace-nowrap px-2 py-2">{item?.phone}</td>
              <td className="whitespace-nowrap px-2 py-2">{item?.city}</td>
              <td className="whitespace-nowrap px-2 py-2">
                <FaEdit
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                  onClick={() => { handleClick(); setId(item?._id); }}
                />
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                <FaTrash
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => { setIsConfirm(true); setId(item?._id); }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

      </div>
    )}
  </div>
  </div>
 
  <Footer />
</>

  );
};

export default ManageParty;
