import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import DyerCard from '../components/DyerCard';

const ApproveDyer = () => {
  const {backendUrl, navigate}=useContext(AdminContext);
  const [dyer, setDyer]=useState([]);

  const fetchForApproval=async()=>{
    try{
      const token=localStorage.getItem("token");
      if (!token){
        toast.error("Please login first");
        return;
      }
      const response=await axios.get(`${backendUrl}/user/getAllUsers`,{headers: {
        Authorization: `Bearer ${token}`
      }})
      if (response.data.success){
        // console.log(response.data.users);
        const filteredDyer=response.data.users.filter((dyer)=>dyer.role==="dyer" && !dyer.approved)
        console.log(filteredDyer);
        setDyer(filteredDyer);
      }
      else{
        toast.error(response.data.message);
      }

    }catch(error){
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); 
        console.log(error.response.data.message);
      } else {
        toast.error("Something went wrong");
        console.log(error.message);
      }
    }
  }

  useEffect(()=>{
    fetchForApproval();
  },[])

  return (
    <div>
        {dyer.length!=0 ? dyer.map((dy, index) => (
          <DyerCard
            key={index}
            id={dy._id}
            company_name={dy.companyName}
            proprietor_name={dy.proprietorName}
            phone={dy.phone}
          />
        )) : <h1 className='text-center text-2xl font-bold'>No Dyer for Approval</h1>}

        
    </div>
  )
}

export default ApproveDyer
