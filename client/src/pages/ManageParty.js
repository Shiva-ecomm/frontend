import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/ManageParty.css'
import EditParty from '../components/EditParty'
import axios from 'axios';
import host from '../APIRoute/host';
import {message} from 'antd';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
const ManageParty = () => {

  const [party,setParty]=useState([]);
  const [isEdit,setIsEdit]=useState(false);
  const [id,setId]=useState();
  const [search,setSearch]=useState('');
  const [filterParties,setFilteredParties]=useState([]);
  const [loading,setLoading]=useState(true);
  const {user}=useSelector((state)=>state.user)
  const navigate=useNavigate()

  const getAllParty=async()=>{
    try{
      setLoading(true);
      const res=await axios.get(`${host}/client/getParties`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        setParty(res.data.parties);
        setFilteredParties(res.data.parties)
        // console.log(res.data.parties);
        setLoading(false)
      }
    }catch(error){
      // console.log(error.message);
      if(error.response && error.response.data){
        message.error(error.response.data.message || 'An error occured. Please try again');
      }else{
        message.error('An error occured.Please try again. ')
      }    }
  };

  const filterParty = () => {
    const lowerCaseSearch = search.toLowerCase();

    const filtered = party.filter(item => {
      // Use optional chaining and default empty string if property is undefined
      return (
        (item.name?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.country?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.email?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.city?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.state?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.country?.toLowerCase() || '').includes(lowerCaseSearch) ||
        (item.companyName?.toLowerCase() || '').includes(lowerCaseSearch)
      );
    });

    setFilteredParties(filtered); // Update the state with filtered results
  };

  useEffect(()=>{
   filterParty();
  //  console.log(party)
  //  console.log(filterParties)
  },[search])


  const handleClick=()=>{
    setIsEdit(!isEdit);
  }
  useEffect(()=>{
    if(!localStorage.getItem('token')){
      navigate('/login')
    }
  },[user,navigate])

  useEffect(()=>{
    getAllParty();
  },[isEdit]);
  return (
    <>
      <EditParty id={id} isEdit={isEdit} handleClick={handleClick} />

      <Header/>
      <div className='main-container container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-center mb-6'>
          <span className='text-primary'>Manage Party</span>
        </h1>
        {loading ? 
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span
          >
        </div>:
        <div className='cont shared-post'>
             {/* Search Component */}
             <div className="mb-3 xl:w-96">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                <input
                    type="search"
                    className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                    placeholder="Search"
                    aria-label="Search"
                    name='search'
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    aria-describedby="button-addon2" />

                {/* <!--Search icon--> */}
                <span
                    className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                    id="basic-addon2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5">
                        <path
                            fillRule="evenodd"
                            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                            clipRule="evenodd" />
                    </svg>
                </span>
            </div>
        </div>
          {filterParties.length===0 ? <div>Please add parties</div> :
        // {/* Table component */}
        <div className="flex flex-col table-container">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th scope="col" className="px-6 py-4">Company Name</th>
              <th scope="col" className="px-6 py-4">Person Name</th>
              <th scope="col" className="px-6 py-4">Email</th>
              <th scope="col" className="px-6 py-4">Mobile</th>
              <th scope="col" className="px-6 py-4">City</th>
              <th scope="col" className="px-6 py-4">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filterParties?.map((item) => (
              
              <tr
                key={item?._id} // Make sure to add a unique key if `item.id` exists
                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
              >
                <td className="whitespace-nowrap px-6 py-4 font-medium">{item?.companyName}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.email}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.phone}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.city}</td> {/* Ensure casing matches */}
                <td className="whitespace-nowrap px-6 py-4">
                  <i className="fa-solid fa-pen-to-square" onClick={()=>{
                    handleClick();
                    setId(item?._id)}}></i> {/* Fixed className */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>}

        </div>
        }
        </div>
      <Footer/>
    </>
  )
}

export default ManageParty
