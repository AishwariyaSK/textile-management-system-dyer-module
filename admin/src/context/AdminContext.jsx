import React from "react";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { batchData, dyerData } from "../assets/Data";

export const AdminContext=createContext();

const AdminContextProvider=({children})=>{

    const backendUrl="https://kumarakurutex-dyer-dashboard-backend.onrender.com/api"

    const navigate=useNavigate();
    const [token, setToken] = useState(null);
    const [batches, setBatches]=useState([]);
    const [singleBatch, setSingleBatch]=useState({});
    const [dyer, setDyer]=useState([]);
    const [singleDyer, setSingleDyer]=useState({});


    const updateToken = (newToken) => {
        //login
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }
    const clearToken = () => {
        //logout
        localStorage.removeItem("token");
        setToken(null);
    }
    const isLoggedIn = () => {
        //useeffect in home
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
        return token != null;
    }

    const handleLogin=({email, password})=>{
        if (email==="admin123@gmail.com" && password==="admin123"){
            localStorage.setItem("token", email);
            setToken(email);
            navigate('/')
        }
        else{
            toast.error("Invalid credentials");
        }
    }

    const fetchBatches=()=>{
        setBatches(batchData);
    }
    const fetchSingleBatch=(id)=>{
        const batch=batchData.find((batch)=>batch._id===id);
        setSingleBatch(batch);
        return batch;
    }

    const fetchDyers=()=>{
        setDyer(dyerData);
    }
    const fetchSingleDyer=(id)=>{
        const dyer=dyerData.find((dyer)=>dyer._id===id);
        setSingleDyer(dyer);
        return dyer;
    }

    const fetchDyerCompanyNames=()=>{
        const companyNames = dyerData.map(dyer => dyer.company_name);
        return companyNames;
    }
    



    useEffect(() => {
        const checkToken=()=>{
            const token = localStorage.getItem("token");
            // console.log("token",token);
            if (token && token !== null) {
                setToken(token);
            }
            else{
                navigate('/login');
            }
        }
        checkToken();
    }, []);

    useEffect(() => {
        fetchBatches();
        fetchDyers();
    }, []);


    const value={
        backendUrl,
        navigate,
        token, setToken, updateToken, clearToken, isLoggedIn,
        handleLogin,
        fetchBatches, batches, setBatches,
        fetchSingleBatch, singleBatch, setSingleBatch,
        fetchDyers, dyer, setDyer,
        fetchSingleDyer, singleDyer, setSingleDyer,
        fetchDyerCompanyNames
          
    }

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider