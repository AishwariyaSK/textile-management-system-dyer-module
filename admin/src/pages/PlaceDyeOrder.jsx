import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
// import { createNotification } from '../../../backend/controllers/notificationController';


const PlaceDyeOrder = () => {
  const { adminData, backendUrl, navigate} = useContext(AdminContext); // Assume dyer ID is in adminData

  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [targetDeliveryDate, setTargetDeliveryDate] = useState('');
  const [tax, setTax] = useState(0);
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
  const [approvedDyers, setApprovedDyers] = useState([]);
  const [selectedDyerId, setSelectedDyerId] = useState('');

  const clearData = () => {
    setPurchaseDate(new Date().toISOString().slice(0, 10));
    setTargetDeliveryDate('');
    setTax(0);
    setOrder([]);
    setTotal(0);
    setSelectedDyerId('');
  }

  const [newItem, setNewItem] = useState({
    clothSize: '',
    colour: '',
    price: ''
  });

  const [errors, setErrors] = useState({});

  const createNotification=async (id)=>{
    try{
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please login to continue')
        return
      }
      console.log('creating notification')
      const res = await axios.post(`${backendUrl}/notification/create`, {message:"new order received", isForAdmin: true, category:"place order", batchId:id}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('notification response',res.data)
      if (res.data.success) {
        // toast.success('Notification created successfully')
      } else {
        // toast.error(res.data.message)
        console.log(res.data.message)
      }
    }catch(err) {
      toast.error('Failed to create notification')
      console.error('notification failed',err)
    }
  }

  const validateItem = () => {
    const itemErrors = {};
    if (!newItem.clothSize) itemErrors.clothSize = 'Size is required';
    if (!newItem.colour) itemErrors.colour = 'Colour is required';
    if (!newItem.price) itemErrors.price = 'Price is required';
    setErrors(itemErrors);
    return Object.keys(itemErrors).length === 0;
  };

  const handleAddItem = () => {
    if (!validateItem()) return;

    const updatedOrder = [...order, { ...newItem, price: parseFloat(newItem.price) }];
    const subtotal = updatedOrder.reduce((acc, item) => acc + item.price, 0);
    setOrder(updatedOrder);
    setTotal(subtotal + parseFloat(tax));
    setNewItem({ clothSize: '', colour: '', price: '' });
    setErrors({});
  };

  const handleDeleteItem = (index) => {
    const updatedOrder = order.filter((_, i) => i !== index);
    const subtotal = updatedOrder.reduce((acc, item) => acc + item.price, 0);
    setOrder(updatedOrder);
    setTotal(subtotal + parseFloat(tax));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedDyerId || !targetDeliveryDate || order.length === 0) {
      toast.error('Please fill all required fields and add at least one item.');
      return;
    }
  
    try {
      const token=localStorage.getItem("token")
      const response = await axios.post(
        `${backendUrl}/purchaseOrder/createDyerPurchaseOrder`,
        {
          dyerId: selectedDyerId,
          purchaseDate,
          targetDeliveryDate,
          order,
          tax: parseFloat(tax)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      toast.success('Order submitted successfully!');
      console.log(response.data);
      clearData();
      // await createNotification(response.data.dyerPurchaseOrder._id);
      console.log('notification created')
    } catch (error) {
      console.error(error);
      toast.error('Error submitting order.');
    }
  };
  

  useEffect(() => {
    const fetchDyers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/user/getAllUsers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const dyers = response.data.users.filter(
          (user) => user.role === 'dyer' && user.approved
        );
        setApprovedDyers(dyers);
      } catch (error) {
        console.error('Failed to fetch dyers:', error);
      }
    };
  
    fetchDyers();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-gray-100 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Dyer Purchase Order</h2>

      <div className="mb-4">
        <label className="block mb-2">Purchase Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Target Delivery Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={targetDeliveryDate}
          onChange={(e) => setTargetDeliveryDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Select Dyer Company</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedDyerId}
          onChange={(e) => setSelectedDyerId(e.target.value)}
          required
        >
          <option value="" disabled>Select a company</option>
          {approvedDyers.map((dyer) => (
            <option key={dyer._id} value={dyer._id}>
              {dyer.companyName}
            </option>
          ))}
        </select>
      </div>
                  

      <div className="mb-4">
        <label className="block mb-2">Tax</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={tax}
          onChange={(e) => {
            const t = parseFloat(e.target.value);
            setTax(t);
            const subtotal = order.reduce((acc, item) => acc + item.price, 0);
            setTotal(subtotal + t);
          }}
        />
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Add Item</h3>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Cloth Size"
            className={`p-2 border rounded ${errors.clothSize ? 'border-red-500' : ''}`}
            value={newItem.clothSize}
            onChange={(e) => setNewItem({ ...newItem, clothSize: e.target.value })}
          />
          <input
            type="text"
            placeholder="Colour"
            className={`p-2 border rounded ${errors.colour ? 'border-red-500' : ''}`}
            value={newItem.colour}
            onChange={(e) => setNewItem({ ...newItem, colour: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className={`p-2 border rounded ${errors.price ? 'border-red-500' : ''}`}
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
        </div>
        <button
          type="button"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleAddItem}
        >
          Add Item
        </button>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Order Items</h3>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border p-2">Cloth Size</th>
              <th className="border p-2">Colour</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {order.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.clothSize}</td>
                <td className="border p-2">{item.colour}</td>
                <td className="border p-2">{item.price}</td>
                <td className="border p-2">
                  <button
                    type="button"
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() => handleDeleteItem(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Total</label>
        <input
          type="number"
          className="w-full p-2 border rounded bg-gray-200"
          value={total}
          readOnly
        />
      </div>

      <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
        Submit Order
      </button>
    </form>
  );
};

export default PlaceDyeOrder;
