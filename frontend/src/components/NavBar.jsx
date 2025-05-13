import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const NavBar = () => {

    const {userDetails, setToken, navigate} = useContext(ShopContext);
    const token=localStorage.getItem("dyer-token");

    const handleLogout=()=>{
        localStorage.removeItem("dyer-token");
        setToken(null);     
        navigate('/signin');
    }

    
   
  return (
    <div className="bg-blue-500 text-white flex items-center p-4">
        <div className="flex-1">
            <h2 className="text-2xl font-bold">Kumarakuru Tex</h2>
        </div>
        
        <div className="flex flex-1 justify-center">
            <h3 className="text-2xl font-bold">
                {token ? userDetails.companyName : ""}
            </h3>
        </div>
        
        <div className="flex flex-1 justify-end items-center space-x-4">
            {token && (
                <>
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/profile" className="hover:underline">Profile</Link>
                    <Link to='/notification' className="hover:underline">Notifications</Link>
                    <p onClick={handleLogout} className="cursor-pointer hover:underline">Logout</p>
                </>
            )}
        </div>
    </div>


  )
}

export default NavBar
