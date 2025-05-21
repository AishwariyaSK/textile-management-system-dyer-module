import { useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const NotificationListener = ({ backendUrl }) => {
  const lastCheckedRef = useRef(Date.now()); // ✅ useRef instead of useState

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
          const now = Date.now();

          const newNotifications = res.data.notifications.filter(
            (n) =>
              n.isForAdmin &&
              !n.seen &&
              new Date(n.dateTime).getTime() > lastCheckedRef.current
          );

          // console.log(newNotifications);
          // console.log(lastCheckedRef.current); // ✅ This will now update properly

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

          // ✅ Update ref immediately
          lastCheckedRef.current = now;
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    const interval = setInterval(pollNotifications, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [backendUrl]);

  return null;
};

export default NotificationListener;
