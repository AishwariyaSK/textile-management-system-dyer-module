import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import DyerCard from '../components/DyerCard';

const ApproveDyer = () => {
  const { backendUrl, navigate } = useContext(AdminContext);
  const [dyer, setDyer] = useState([]);
  const [loading, setLoading] = useState(true); // 🌀 Loading state

  const fetchForApproval = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }
      setLoading(true); // start loading

      const response = await axios.get(`${backendUrl}/user/getAllUsers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const filteredDyer = response.data.users.filter(
          (dyer) => dyer.role === "dyer" && !dyer.approved
        );
        setDyer(filteredDyer);
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false); // done loading
    }
  };

  useEffect(() => {
    fetchForApproval();
  }, []);

  return (
    <div>
      {loading ? (
        <h1 className='text-center text-xl text-gray-600'>Loading...</h1>
      ) : dyer.length !== 0 ? (
        dyer.map((dy, index) => (
          <DyerCard
            key={index}
            id={dy._id}
            company_name={dy.companyName}
            proprietor_name={dy.proprietorName}
            phone={dy.phone}
          />
        ))
      ) : (
        <h1 className='text-center text-2xl font-bold'>No Dyer for Approval</h1>
      )}
    </div>
  );
};

export default ApproveDyer;
