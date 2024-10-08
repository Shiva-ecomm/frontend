import React, { useState,useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Post.css'
import { TERipple } from "tw-elements-react";
import { message } from 'antd';
import axios from 'axios';
import host from '../APIRoute/host';
import { useSelector } from 'react-redux';
import Confirmation from '../components/Confirmation';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
    const [files, setFiles] = useState([]);
    const [title,setTitle]=useState('');
    const [qty,setQty]=useState('');
    const [descr,setDescr]=useState('');
    
  const [party,setParty]=useState([]);
  const [isEdit,setIsEdit]=useState(false);
  const [id,setId]=useState();
  const [search,setSearch]=useState('');
  const [filterParties,setFilteredParties]=useState([])
  const [selectedParties,setSelectedParties]=useState([]);
  const [selectAll,setSelectAll]=useState(true);
  const [isConfirm,setIsConfirm]=useState(false);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate()

  const {user}=useSelector((state)=>state.user)
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
  
    const handleSubmit=async()=>{
      console.log(files);
      setIsConfirm(false);
      setLoading(true)
      try{
        const formData = new FormData();

        // Append files to FormData
        files.forEach(file => {
            formData.append('files', file);
        });

        // Append other data to FormData
        formData.append('title', title);
        formData.append('descr', descr);
        formData.append('qty', qty);
        formData.append('id', user?._id);
        formData.append('name', user?.name);
        const validPartyIds = selectedParties.map(party => party._id);
        formData.append('validParty', JSON.stringify(validPartyIds));
        const res=await axios.post(`${host}/tendor/upload-images`,formData,{
          headers:{
            authorization:`Bearer ${localStorage.getItem('token')}`
          }
        })
        if(res.data.success){
          message.success('A new Tendor is opened. It will close exactly after 48 hours')
          // console.log(res.data)
          navigate('/')
        }
        
      }catch(error){
        console.log(error.message);
        message.error('Something went wrong');
      }
     
      setLoading(false)
    };

    
  const getAllParty=async()=>{
    try{
      const res=await axios.get(`${host}/client/getParties`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        // message.success(res.data.message);
        setParty(res.data.parties);
        setFilteredParties(res.data.parties)
        // console.log(res.data.parties);
      }
    }catch(error){
      console.log(error.message);
      message.error('Something went wrong');
    }
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


  const handleClick = (item) => {
    setSelectedParties((prevParties) => {
      // Check if the item already exists in the array
      const exists = prevParties.some((party) => party._id === item._id);
      // If it doesn't exist, add the new item
      if (!exists) {
        return [...prevParties, item];
      }
      return prevParties; // Return the existing array if it exists
    });
  }
  
  
  const handleRemoveClick = (id) => {
    setSelectedParties((items) => {
      return items.filter((item) => item?._id !== id);
    });
  }

  const handleSelectAll=()=>{
    if(selectAll){
      setSelectedParties(filterParties);
    }else{
      setSelectedParties([]);
    }
    setSelectAll(!selectAll);

  }

  const isValid = title && qty && descr && selectedParties.length > 0;

  useEffect(()=>{
    getAllParty();
  },[isEdit]);

  useEffect(()=>{

  },[selectedParties])
  useEffect(()=>{
    if(!localStorage.getItem('token')){
      navigate('/login')
    }
  },[user,navigate])

  return (
    <>
      <Header/>
      <Confirmation isConfirm={isConfirm} setIsConfirm={setIsConfirm} onConfirm={handleSubmit} />
      {loading ? <Loader/> :
      
        <div>
        <h1 class="text-4xl font-bold text-gray-900 leading-tight mb-2 pb-4 relative tendor-header">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Add Tendor</span>
        <span class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
        </h1>  

        <div className='post-divider'>
        <div className='post-content shared-post'>
          <div className='input-group'>
            <label className='input-label' aria-required>Title:</label>
            <input type='text' placeholder='Enter title' name='title' value={title} onChange={(e)=>setTitle(e.target.value)} required />
          </div>
          <div className='input-group'>
            <label className='input-label' aria-required>Quantity:</label>
            <input type='text' placeholder='Enter quantity (e.g 100 kg)' name='qty' value={qty} onChange={(e)=>setQty(e.target.value)} required/>
          </div>
          <div className='input-group'>
            <label className='input-label' aria-required>Description:</label>
            <textarea placeholder='Enter description' name='descr' value={descr} onChange={(e)=>setDescr(e.target.value)} required ></textarea>
          </div>

          <div className='input-group'>
            <label className='input-label'>Upload Images:</label>
            <input 
              type='file' 
              multiple 
              accept='image/*' 
              onChange={handleFileChange} 
              className='file-input' 
            />
            <div className='image-preview'>
              {files.map((file, index) => (
                <div key={index} className='image-thumbnail'>
                  <img src={URL.createObjectURL(file)} alt={`preview ${index}`} />
                  <button onClick={() => handleRemoveFile(file)} className='remove-btn'>✖</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='party-content shared-post'>
            {/* Search Component */}
            <div className="mb-3 xl:w-96 party-table-containers" style={{display:'flex',width:'75%',margin:'5px'}}>
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
                {/* <span
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
                </span> */}
            </div>
            <button
                              type="button"
                              style={{ fontSize: '0.7rem',width:'105px',height:'40px' }}
                              onClick={handleSelectAll}
                              className="add-btn inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                            >
                              {selectAll ? 'Select All' : 'Remove All'}</button>        </div>

        {/* Table component */}
        <div className="flex flex-col table-container">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
            <th scope="col" className="px-6 py-4" >Select</th>
              <th scope="col" className="px-6 py-4">Company Name</th>
              <th scope="col" className="px-6 py-4">Person Name</th>
              <th scope="col" className="px-6 py-4">Email</th>
              <th scope="col" className="px-6 py-4">Mobile</th>
              <th scope="col" className="px-6 py-4">City</th>
            </tr>
          </thead>
          <tbody>
            {filterParties?.map((item) => (
              
              <tr
                key={item?._id} // Make sure to add a unique key if `item.id` exists
                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
              >
                <td className="whitespace-nowrap px-6 py-4"  style={{cursor:'pointer'}}>
                <i class="fa-solid fa-check" onClick={()=>{
                    handleClick(item);
                    }}></i> {/* Fixed className */}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-medium">{item?.companyName}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.email}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.phone}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.city}</td> {/* Ensure casing matches */}
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
        {/* Share component */}
        <div className='share'>
            <span>It will be shared on : Gmail</span>

            <div className='tags'>
                <div className='sub-tags'>
                    {/* <input type="radio" /> */}
                    <i class="fa-brands fa-google-plus"></i>
                </div>
                {/* <div className='sub-tags'>
                    <input type="radio" />
                    <i class="fa-brands fa-whatsapp"></i>
                </div> */}

            </div>

        </div>

                  {
                    selectedParties.length !==0 ?
                    (

            // {/* Table component */}

                <div className="flex flex-col table-container">
  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
            <th scope="col" className="px-6 py-4">Remove</th>
              <th scope="col" className="px-6 py-4">Company Name</th>
              <th scope="col" className="px-6 py-4">Person Name</th>
              <th scope="col" className="px-6 py-4">Email</th>
              <th scope="col" className="px-6 py-4">Mobile</th>
              <th scope="col" className="px-6 py-4">City</th>
            </tr>
          </thead>
          <tbody>
            {selectedParties?.map((item) => (
              
              <tr
                key={item?._id} // Make sure to add a unique key if `item.id` exists
                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
              >
                <td className="whitespace-nowrap px-6 py-4"  style={{cursor:'pointer'}}>
                <i class="fa-solid fa-xmark" onClick={()=>{
                    handleRemoveClick(item?._id);
                    }}></i> {/* Fixed className */}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-medium">{item?.companyName}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.email}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.phone}</td>
                <td className="whitespace-nowrap px-6 py-4">{item?.city}</td> {/* Ensure casing matches */}
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>): (<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
  <span>No Party added</span>
</div>
  )
}

            {/*Button  */}
            <TERipple rippleColor="light">
            <button
              type="button"
              onClick={()=>setIsConfirm(true)}
              className="add-btn inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow transition duration-150 ease-in-out hover:bg-primary-600 focus:outline-none"
              disabled={!isValid} 
              >
              
              Submit
            </button>
          </TERipple>

        </div>
        </div>

        </div>
}
      <Footer/>
    </>
  )
}

export default AddPost
