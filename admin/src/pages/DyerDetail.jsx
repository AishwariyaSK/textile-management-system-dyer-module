import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useParams } from 'react-router-dom'
import DyerSummary from '../components/DyerSummary'
import { toast } from 'react-toastify'
import axios from 'axios'

const DyerDetail = () => {
  const { singleDyer, fetchSingleDyer, backendUrl } = useContext(AdminContext)
  const { id } = useParams()
  const [dyer, setDyer] = useState({})

  const fetchDyer=async()=>{
    const token=localStorage.getItem("token");
    if (!token){
      toast.error("Please login first");
      return;
    }
    try{
      const response=await axios.get(`${backendUrl}/user/getUser/${id}`,{headers: {
        Authorization: `Bearer ${token}`
      }})
      if (response.data.success){
        setDyer(response.data.user);
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

  const handleApprove=async()=>{
    const token=localStorage.getItem("token");
    if (!token){
      toast.error("Please login first");
      return;
    }
    try{
      const response=await axios.patch(`${backendUrl}/user/approveDyer/${id}`,{},{headers: {
        Authorization: `Bearer ${token}`
      }})
      
      if (response.data.success){
        toast.success(response.data.message);
        fetchDyer();
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


  useEffect(() => {
    fetchDyer()
  }, [id]);

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h2 className="text-2xl font-bold mb-6">{dyer.companyName}</h2>
      <div className="bg-white rounded shadow p-6 space-y-4">
        <p><strong>Company Id:</strong> {dyer._id}</p>
        <p><strong>Proprietor Name:</strong> {dyer.proprietorName}</p>
        <p><strong>Phone:</strong> {dyer.phone}</p>
        <p><strong>Email:</strong> {dyer.email}</p>
        <p><strong>Address:</strong> {dyer.address}</p>
        <p><strong>Approved:</strong> {dyer.approved ? "True" : "False"}</p>
        {
          !dyer.approved && 
          <div>
            <button className='bg-blue-500 text-white p-2 rounded' onClick={handleApprove}>Approve</button>
          </div>
        }
      </div>
      {dyer.approved && <div>
        <DyerSummary dyerId={dyer._id} />
      </div>}
      <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => navigate("/approve-dyer")}
        >
          Back
      </button>
    </div>
  )
}

export default DyerDetail
