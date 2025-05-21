// src/components/NotificationListener.jsx
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const NotificationListener = ({ backendUrl }) => {
  const lastCheckedRef = useRef(Date.now());

  useEffect(() => {
    const pollNotifications = async () => {
      const token = localStorage.getItem("dyer-token");
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
              !n.isForAdmin &&
              !n.seen &&
              new Date(n.dateTime).getTime() > lastCheckedRef.current
          );

          // console.log(newNotifications);
          // console.log(lastCheckedRef.current);

          if (newNotifications.length > 0) {
            const firstNotification = newNotifications[0];

            // Show toast
            toast.info(firstNotification.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });

            // // Optional: Mark it as seen to prevent repeated toasts on backend
            // try {
            //   await axios.post(
            //     `${backendUrl}/notification/mark-seen`,
            //     { id: firstNotification._id },
            //     {
            //       headers: {
            //         Authorization: `Bearer ${token}`,
            //       },
            //     }
            //   );
            // } catch (markErr) {
            //   console.error("Failed to mark notification as seen:", markErr);
            // }
          }

          // Update the ref no matter what
          lastCheckedRef.current = now;
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    const interval = setInterval(pollNotifications, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, [backendUrl]);

  return null; // No UI, just effect
};

export default NotificationListener;
