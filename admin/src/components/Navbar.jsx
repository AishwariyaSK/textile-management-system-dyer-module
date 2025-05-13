import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext';
import { Link } from 'react-router-dom';

const NavBar = () => {

    const {setToken, token, navigate} = useContext(AdminContext);

    const handleLogout=()=>{
        localStorage.removeItem("token");
        setToken(null);     
        navigate('/login');
    }
   
  return (
    <div className="bg-blue-500 text-white flex items-center p-4">
        <div className="flex-1">
            <h2 className="text-2xl font-bold">Kumarakuru Tex</h2>
        </div>
        <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </div>
        <div className="flex flex-1 justify-end items-center space-x-4">
            {token && (
                <>
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/place-dye-order" className="hover:underline">Place order</Link>
                    <Link to="/approve-dyer" className="hover:underline">Approve</Link>
                    <Link to="/dyer-list" className="hover:underline">Dyers</Link>
                    <Link to="/notification" className="hover:underline">Notification</Link>
                    <Link to="/profile" className="hover:underline">Profile</Link>
                    <p onClick={handleLogout} className="cursor-pointer hover:underline">Logout</p>
                </>
            )}
        </div>
    </div>


  )
}

export default NavBar
