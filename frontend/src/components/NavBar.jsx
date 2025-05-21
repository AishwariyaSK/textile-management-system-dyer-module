import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const NavBar = () => {
  const { userDetails, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tokenPresent, setTokenPresent] = useState(false);
  const [user, setUser] = useState({});

  const fetchUserDetails=async()=>{
    const token=localStorage.getItem("dyer-token");
    if (!token){
      toast.error("Please login first");
      return;
    }
    try{
      const response=await axios.get(`${backendUrl}/user/getUser/${userDetails._id}`,{headers: {
        Authorization: `Bearer ${token}`
      }})
      if (response.data.success){
        setUser(response.data.user);
      }
      else{
        // toast.error(response.data.message);
        console.log(response.data.message);
      }
    }catch(error){
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); 
        console.log(error.response.data.message);
      } else {
        // toast.error("Something went wrong");
        console.log(error.message);
      }
    }
  }

  useEffect(() => {
    const loadFun=async()=>{
        const token = localStorage.getItem("dyer-token");
        setTokenPresent(!!token);
        if (token){await fetchUserDetails();}
    }
    loadFun();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dyer-token");
    localStorage.removeItem("deadlineReminderShown");

    setToken(null);
    navigate('/signin');
  };

  return (
    <nav className="bg-blue-500 text-white px-4 py-3 flex items-center justify-between flex-wrap">
      <div className="flex items-center flex-shrink-0 mr-6">
        <h1 className="text-2xl font-bold">Kumarakuru Tex</h1>
      </div>

      <div className="block lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center px-3 py-2 border rounded text-white border-white hover:text-blue-200"
        >
          <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
            <title>Menu</title>
            <path d="M0 3h20v2H0zM0 9h20v2H0zM0 15h20v2H0z" />
          </svg>
        </button>
      </div>

      {tokenPresent && (
        <div className="w-full flex-1 lg:flex lg:items-center lg:w-auto">
          <div className="text-center lg:flex-grow lg:ml-4">
            <h2 className="text-xl font-semibold mb-2 lg:mb-0">{user?.companyName}</h2>
          </div>

          <div
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } w-full lg:flex lg:items-center lg:w-auto lg:space-x-6`}
          >
            <NavLink to="/" className={({ isActive }) => isActive ? "underline font-bold" : "hover:underline"}>
              Home
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "underline font-bold" : "hover:underline"}>
              Profile
            </NavLink>
            <NavLink to="/notification" className={({ isActive }) => isActive ? "underline font-bold" : "hover:underline"}>
              Notifications
            </NavLink>
            <button
              onClick={handleLogout}
              className="hover:underline cursor-pointer mt-2 lg:mt-0"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
