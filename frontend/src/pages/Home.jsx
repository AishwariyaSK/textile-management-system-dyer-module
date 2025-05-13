import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import BatchCard from "../components/BatchCard";
import { toast } from "react-toastify";
import axios from "axios";

const FILTER_OPTIONS = [
  'sent for dyeing',
  'received for dyeing',
  'sent dyed material',
  'received dyed material',
  'quality check',
  'payment',
  'completed'
];

const Home = () => {
  const { navigate, backendUrl } = useContext(ShopContext);
  const [allBatches, setAllBatches] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const fetchBatchData = async () => {
    try {
      const token = localStorage.getItem("dyer-token");
      if (!token) {
        toast.error("Please login to continue");
        navigate("/signin");
        return;
      }
      

      const res = await axios.get(`${backendUrl}/purchaseOrder/getDyerPurchaseOrderByDyerId`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        setAllBatches(res.data.purchaseOrders);
      } 
      else if (res.status==401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("dyer-token");
        navigate("/signin");
      }
      else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to fetch orders");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBatchData();
  }, []);

  const handleCheckboxChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredBatches =
    selectedStatuses.length === 0
      ? allBatches
      : allBatches.filter((batch) => selectedStatuses.includes(batch.status));

  return (
    <div className="flex flex-col sm:grid sm:grid-cols-[1fr_3fr]">
      <div className="m-4">
        <h1 className="text-2xl font-bold m-3">Filter</h1>
        <div className="border border-gray-300 p-2 mb-4 w-64 rounded">
          {FILTER_OPTIONS.map((status) => (
            <div className="flex items-center mb-2" key={status}>
              <input
                type="checkbox"
                id={status}
                value={status}
                className="mr-2"
                onChange={() => handleCheckboxChange(status)}
                checked={selectedStatuses.includes(status)}
              />
              <label htmlFor={status} className="capitalize">
                {status}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        {filteredBatches.length === 0 ? (
          <h1 className="text-2xl font-bold m-3">No orders yet</h1>
        ) : (
          filteredBatches.map((batch, index) => (
            <BatchCard
              key={index}
              id={batch._id}
              status={batch.status}
              products={batch.products}
              targetDeliveryDate={batch.targetDeliveryDate}
              purchaseDate={batch.purchaseDate}
              // quantity={batch.orders.length}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
