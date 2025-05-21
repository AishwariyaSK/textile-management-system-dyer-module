import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from "react";

const BatchDetail = () => {
  const { backendUrl } = useContext(ShopContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const pdfRef = useRef();

  const [order, setOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const statusFlow = [
    "sent for dyeing",
    "received for dyeing",
    "sent dyed material",
    "received dyed material",
    "quality check",
    "payment",
    "completed"
  ];

  const allowedToUpdate = ["sent for dyeing", "received for dyeing"];


  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("dyer-token");
      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }
      const res = await axios.get(`${backendUrl}/purchaseOrder/getDyerPurchaseOrder/${id}`,{headers: {
        Authorization: `Bearer ${token}`
      }});
      if (res.data.success) setOrder(res.data.purchaseOrder);
      else toast.error(res.data.message);
    } catch (err) {
      toast.error("Failed to fetch order");
    }
  };

  const getNextStatus = (currentStatus) => {
    const index = statusFlow.indexOf(currentStatus);
    return index !== -1 && index < statusFlow.length - 1 ? statusFlow[index + 1] : null;
  };

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    try {
      const token = localStorage.getItem("dyer-token");
      const res = await axios.patch(`${backendUrl}/purchaseOrder/updateDyerPurchaseOrderStatus/${id}`, {
        newStatus: nextStatus,
      },
      {headers: {
        Authorization: `Bearer ${token}`
      }});

      if (res.data.success) {
        toast.success("Status updated");
        setOrder((prev) => ({
          ...prev,
          status: res.data.updatedStatus
        }));
        // await createNotification();
        
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }

    setShowModal(false);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text("Dyer Purchase Order", 14, 20);
  
    doc.setFontSize(12);
    doc.text(`Purchase Date: ${new Date(order.purchaseDate).toLocaleDateString()}`, 14, 35);
    doc.text(`Target Delivery Date: ${new Date(order.targetDeliveryDate).toLocaleDateString()}`, 14, 45);
    doc.text(`Status: ${order.status}`, 14, 55);
    doc.text(`Tax: ₹${order.tax}`, 14, 65);
    doc.text(`Total: ₹${order.total}`, 14, 75);
  
    doc.text("Order Items:", 14, 90);
  
    let y = 100;
    order.order.forEach((item, idx) => {
      doc.text(`• ${item.clothSize}, ${item.colour}, ₹${item.price}`, 16, y);
      y += 10;
    });
  
    doc.save(`purchase-order-${order._id}.pdf`);
  };
  
  

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!order) return <div className="p-4">Loading order...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Dyer Purchase Order Details</h2>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto">
        {statusFlow.map((step, idx) => (
          <div key={idx} className="flex-1 flex items-center min-w-max">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center text-white ${
                statusFlow.indexOf(order.status) >= idx ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              {idx + 1}
            </div>
            <span className="ml-2 text-sm text-gray-700 whitespace-nowrap capitalize">
              {step}
            </span>
            {idx !== statusFlow.length - 1 && (
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Order Info */}
      <div ref={pdfRef}  className="bg-white rounded shadow p-6 space-y-4">
        <p><strong>Purchase Date:</strong> {new Date(order.purchaseDate).toLocaleDateString()}</p>
        <p><strong>Target Delivery Date:</strong> {new Date(order.targetDeliveryDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ₹{order.total}</p>
        <p><strong>Tax:</strong> ₹{order.tax}</p>

        <div>
          <h3 className="font-semibold text-lg mb-2">Order Items:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {order.order.map((item, idx) => (
              <div key={idx} className="border p-4 rounded shadow bg-gray-50">
                <p><strong>Cloth Size:</strong> {item.clothSize}</p>
                <p><strong>Colour:</strong> {item.colour}</p>
                <p><strong>Price:</strong> ₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Back
        </button>

        {/* <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleDownload}
        >
          Download Order
        </button> */}


        {/* {
          order.status==='payment' &&(
            <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => toast.success("Payment Done")}
          >
            pay now
          </button>
        )
        } */}

        {allowedToUpdate.includes(order.status) && getNextStatus(order.status) && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(true)}
          >
            Update Status
          </button>
        )}

        

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Status Update</h3>
            <p className="mb-4">
              Are you sure you want to update the status from <strong>{order.status}</strong> to <strong>{getNextStatus(order.status)}</strong>? <br />
              <span className="text-red-600 text-sm">Once updated, it cannot be undone.</span>
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleStatusUpdate}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchDetail;
