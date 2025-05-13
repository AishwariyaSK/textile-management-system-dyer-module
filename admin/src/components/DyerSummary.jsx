import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';

const DyerSummary = ({ dyerId }) => {
  const { backendUrl, navigate } = useContext(AdminContext);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to continue');
        return;
      }

      const res = await axios.get(`${backendUrl}/purchaseOrder/getDyerPurchaseOrderByDyerId/${dyerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setPurchaseOrders(res.data.purchaseOrders);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to fetch orders');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dyer Purchase Order Summary</h2>
      {purchaseOrders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-2 px-4 border">Purchase Date</th>
                <th className="py-2 px-4 border">Target Delivery</th>
                <th className="py-2 px-4 border">Dyer</th>
                <th className="py-2 px-4 border">Items</th>
                <th className="py-2 px-4 border">Tax</th>
                <th className="py-2 px-4 border">Total</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <tr key={po._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border">{new Date(po.purchaseDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">{new Date(po.targetDeliveryDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">{po.dyer?.companyName || 'N/A'}</td>
                  <td className="py-2 px-4 border">
                    <ul className="list-disc list-inside">
                      {po.order.map((item, idx) => (
                        <li key={idx}>
                          {item.clothSize}, {item.colour}, ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2 px-4 border">₹{po.tax}</td>
                  <td className="py-2 px-4 border">₹{po.total}</td>
                  <td className="py-2 px-4 border">{po.status}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      onClick={() => navigate(`/batch/${po._id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DyerSummary;
