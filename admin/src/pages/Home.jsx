import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import BatchCard from "../components/BatchCard";
import { toast } from "react-toastify";
import axios from "axios";

const Home = () => {
  const { backendUrl, navigate } = useContext(AdminContext);

  const [batches, setBatches] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [sortBy, setSortBy] = useState("");

  const statusFilter = [
    { id: "sent-for-dyeing", label: "Sent For Dyeing", value: "sent for dyeing" },
    { id: "received-for-dyeing", label: "Received For Dyeing", value: "received for dyeing" },
    { id: "sent-dyed-material", label: "Sent Dyed Material", value: "sent dyed material" },
    { id: "received-dyed-material", label: "Received Dyed Material", value: "received dyed material" },
    { id: "quality-check", label: "Quality Check", value: "quality check" },
    { id: "payment", label: "Payment", value: "payment" },
    { id: "completed", label: "Completed", value: "completed" },
  ];

  const [loading, setLoading] = useState(true); // 🔄 loading flag



  const handleStatusChange = (value) => {
    setSelectedStatus((prev) =>
      prev.includes(value) ? prev.filter((status) => status !== value) : [...prev, value]
    );
  };

  const handleError = (error) => {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleAuthErrors = (response) => {
    if (response.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("paymentReminderShown");
      navigate("/signin");
    } else if (response.status === 403) {
      toast.error("You are not authorized to access this page");
      navigate("/signin");
    } else {
      toast.error(response.data?.message || "Unexpected error");
    }
  };

  const fetchBatches = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/signin");
    return [];
  }

  try {
    const response = await axios.get(`${backendUrl}/purchaseOrder/getAllDyerPurchaseOrders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      const allBatches = response.data.purchaseOrders;
      setBatches(allBatches);
      return allBatches;
    } else {
      handleAuthErrors(response);
      return [];
    }
  } catch (error) {
    handleError(error);
    return [];
  }
};


  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/user/getAllUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const dyers = response.data.users.filter(user => user.role === "dyer" && user.approved);
        const uniqueCompanies = [...new Set(dyers.map(d => d.companyName))];
        setCompanyList(uniqueCompanies);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSortChange = (e) => setSortBy(e.target.value);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [fetchedBatches] = await Promise.all([fetchBatches(), fetchCompanies()]);
      setLoading(false);

      const pendingPayments = fetchedBatches.filter((batch) => batch.status === "payment");
      console.log(pendingPayments.length, fetchedBatches.length);

      const reminderShown = localStorage.getItem("paymentReminderShown");
      if (!reminderShown && pendingPayments.length > 0) {
        if (pendingPayments.length === 1) {toast.warn(`You have payment pending for ${pendingPayments.length} order`);}
        else {toast.warn(`You have payment pending for ${pendingPayments.length} orders`);}
        localStorage.setItem("paymentReminderShown", "true");
      }
    };

    fetchData();
}, []);


  useEffect(() => {
    let data = [...batches];

    if (selectedStatus.length > 0) {
      data = data.filter(batch => selectedStatus.includes(batch.status));
    }

    if (selectedCompany) {
      data = data.filter(batch => batch.dyer?.companyName === selectedCompany);
    }

    if (sortBy) {
      data.sort((a, b) => {
        const aDate = new Date(a[sortBy]);
        const bDate = new Date(b[sortBy]);
        return aDate - bDate;
      });
    }

    setFilteredData(data);
  }, [selectedStatus, selectedCompany, sortBy, batches]);

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-1/4 p-4 border-r overflow-y-auto sticky top-0 h-screen bg-white z-10">
        <h1 className="text-2xl font-bold mb-2">Filter</h1>

        <label className="block font-semibold mt-4 mb-1">Status</label>
        <div className="border border-gray-300 p-2 mb-4 rounded">
          {statusFilter.map((status) => (
            <div className="flex items-center mb-2" key={status.id}>
              <input
                type="checkbox"
                id={status.id}
                value={status.value}
                className="mr-2"
                onChange={() => handleStatusChange(status.value)}
              />
              <label htmlFor={status.id}>{status.label}</label>
            </div>
          ))}
        </div>

        <label className="block font-semibold mb-1">Company Name</label>
        <select
          className="border p-2 rounded w-full mb-4"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">All Companies</option>
          {companyList.map((name, idx) => (
            <option key={idx} value={name}>{name}</option>
          ))}
        </select>

        <label className="block font-semibold mb-1">Sort By</label>
        <select
          className="border p-2 rounded w-full"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">None</option>
          <option value="purchaseDate">Purchase Date</option>
          <option value="targetDeliveryDate">Target Delivery Date</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <h1 className="text-2xl font-semibold text-gray-600">Loading...</h1> // 🌀 Loading state
        ) : filteredData.length > 0 ? (
          filteredData.map((batch, index) => (
            <BatchCard
              key={index}
              id={batch._id}
              company_name={batch.dyer?.companyName}
              status={batch.status}
            />
          ))
        ) : (
          <h1 className="text-2xl font-bold">No batches found</h1> // Only shown when not loading
        )}
      </div>

    </div>
  );
};

export default Home;
