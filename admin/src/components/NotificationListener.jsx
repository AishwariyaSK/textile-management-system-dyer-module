// src/components/NotificationListener.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const NotificationListener = ({ backendUrl }) => {
  const [lastChecked, setLastChecked] = useState(Date.now());

  useEffect(() => {
    const pollNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${backendUrl}/notification`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          const newNotifications = res.data.notifications.filter(
            (n) =>
              n.isForAdmin &&
              !n.seen &&
              new Date(n.dateTime).getTime() > lastChecked
          );

          if (newNotifications.length > 0) {
            toast.info(newNotifications[0].message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            
          }
          setLastChecked(Date.now());
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    const interval = setInterval(pollNotifications, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, [backendUrl]);

  return null; // No UI, just effect
};

export default NotificationListener;
