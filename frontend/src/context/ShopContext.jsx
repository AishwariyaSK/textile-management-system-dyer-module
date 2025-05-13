import React from "react";
import { createContext, useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import {userData, batchData} from '../assets/Data'
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {

    const backendUrl="http://localhost:5000/api";
    
    const navigate=useNavigate();
    const [token, setToken] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    
    const [userBatches, setUserBatches]=useState([]);
    const [singleBatch, setSingleBatch]=useState({});

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

    
    const handleLogin = ({email,password}) => {
        try{
            const user= userData.find((user) => user.email === email);
            if (user){
                if (user.password === password){
                    if (user.approved){
                        setUserDetails(user);
                        localStorage.setItem("token", email);
                        setToken(email);
                        navigate('/')
                    }
                    else{
                        toast.error("User not approved yet");
                    }
                }
                else{
                    toast.error("Invalid password");
                }
            }
            else{
                toast.error("User not found");
            }
        }catch(error){
            console.log(error);
            toast.error(error);
        }  
    }

    const handleSignUp=({companyName, proprietorName, email, phone, address, password})=>{
        try{
            const user= userData.find((user) => user.email === email);
            if (user && user.approved){
                toast.error("User already exists");
            }
            else if (user && !user.approved){
                toast.error("User already exists, but not approved yet");
            }
            else{
                const newUser={
                    company_name: companyName,
                    proprietor_name: proprietorName,
                    email: email,
                    phone: phone,
                    address: address,
                    password: password,
                    approved:false,
                }
                userData.push(newUser);
                navigate('/request-approval');
            }
        }catch(error){
            console.log(error);
            toast.error(error);
        }
    }

    const fetchUserDetails = async () => {
        try{
            const user= userData.find((user) => user.email === token);
            // console.log("token",token);
            // console.log("user",user);
            if (user){
                setUserDetails(user);
            }
            else{
                console.log("User not found");
            }

        }catch(error){
            console.log(error);
        }
    }

    const fetchUserBatches=()=>{
        try{
            const companyName=userDetails?.company_name

            if (companyName){
                const batches=batchData.filter((batch)=>batch.company_name===companyName)
                console.log(batches);
                setUserBatches(batches)
            }
            else{
                console.log("user or companyname not found");
            }

        }catch(error){
            console.log(error);
        }
    }
    const fetchSingleBatch=(id)=>{
        try{
            const batch=batchData.find((batch)=>batch._id===id)
            setSingleBatch(batch)
            return batch;
        }catch(error){
            console.log(error);
        }
    }

    
    // useEffect(() => {
    //     const checkToken = () => {
    //         const t = localStorage.getItem("token");
    //         const currentPath = window.location.pathname;
    //         if (t && t !== "null") {
    //             setToken(t);
    //             // console.log("token..", t);
    //         } else {
    //             if (!['/signup', '/request-approval'].includes(currentPath)) {
    //                 navigate('/signin');
    //             }
    //         }
    //     };
    //     checkToken();
        
    // }, []);
    // useEffect(() => {
    //     if (token) {
    //         fetchUserDetails();
    //     }
    // }, [token]);     

    // useEffect(() => {
    //     if (userDetails?.company_name) {
    //       fetchUserBatches();
    //     }
    //   }, [userDetails]);
         
    

    const value={
        backendUrl,
        navigate,
        updateToken, clearToken, isLoggedIn, token, setToken,
        userDetails, setUserDetails, handleLogin, handleSignUp,
        userBatches, setUserBatches, fetchUserBatches, fetchSingleBatch



    }

    return(
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;