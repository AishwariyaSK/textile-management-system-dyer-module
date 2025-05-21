import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import NotificationCard from '../components/NotificationCard';

const Notification = () => {
  const { backendUrl, navigate } = useContext(AdminContext);

  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true); // 🌀 NEW

  const categories = ['', 'status update', 'payment pending', 'approve'];

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      return;
    }

    setLoading(true); // ⏳ Start loading

    try {
      const res = await axios.get(`${backendUrl}/notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setNotifications(res.data.notifications);
        setFilteredNotifications(res.data.notifications);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to fetch notifications');
      }
    } finally {
      setLoading(false); // ✅ Done loading
    }
  };

  const handleFilterChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category === '') {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(notifications.filter(n => n.category === category));
    }
  };

  const handleClearAll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      return;
    }

    try {
      const res = await axios.delete(`${backendUrl}/notification/deleteAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success('All notifications cleared');
        setNotifications([]);
        setFilteredNotifications([]);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to clear notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className='flex flex-col'>
      {/* Filter + Clear All Controls */}
      <div className='flex flex-col items-center'>
        <div className='item-center m-5'>
          <div>
            <select value={selectedCategory} onChange={handleFilterChange} className='border-2 border-gray-300 rounded-md p-2'>
              <option value="">All Categories</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button onClick={handleClearAll} className='ml-4 bg-red-500 text-white rounded-md p-2'>
              Clear All Notifications
            </button>
          </div>
        </div>
      </div>

      {/* Loading, Data, or Empty */}
      {loading ? (
        <p className='text-center text-gray-500 text-lg'>Loading...</p>
      ) : filteredNotifications.length > 0 ? (
        filteredNotifications.map((notification) => (
          <NotificationCard
            key={notification._id}
            id={notification._id}
            userId={notification.userId}
            isForAdmin={notification.isForAdmin}
            batchId={notification.batchId}
            message={notification.message}
            seen={notification.seen}
            dateTime={notification.dateTime}
            category={notification.category}
            onDelete={() => {
              setNotifications(prev => prev.filter(n => n._id !== notification._id));
              setFilteredNotifications(prev => prev.filter(n => n._id !== notification._id));
            }}
          />
        ))
      ) : (
        <p className='text-center text-gray-600'>No notifications available</p>
      )}
    </div>
  );
};

export default Notification;
