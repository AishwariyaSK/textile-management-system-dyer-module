import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import DyerCard from '../components/DyerCard';
import { toast } from 'react-toastify';
import axios from 'axios';

const DyerPage = () => {
  const { backendUrl } = useContext(AdminContext);
  const [dyer, setDyer] = useState([]);
  const [loading, setLoading] = useState(true); // 🌀 Loading state

  const fetchDyer = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }
    setLoading(true); // start loading

    try {
      const response = await axios.get(`${backendUrl}/user/getAllUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const filteredDyer = response.data.users.filter(user => user.role === 'dyer');
        setDyer(filteredDyer);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false); // end loading
    }
  };

  useEffect(() => {
    fetchDyer();
  }, []);

  return (
    <div>
      {loading ? (
        <h1 className="text-center text-xl text-gray-600">Loading...</h1>
      ) : dyer.length > 0 ? (
        dyer.map((dy, index) => (
          <DyerCard
            key={index}
            id={dy._id}
            role={dy.role}
            company_name={dy.companyName}
            proprietor_name={dy.proprietorName}
            phone={dy.phone}
          />
        ))
      ) : (
        <h1 className="text-center text-2xl font-bold">No dyers found</h1>
      )}
    </div>
  );
};

export default DyerPage;
