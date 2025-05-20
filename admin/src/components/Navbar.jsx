import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Requires Heroicons

const NavBar = () => {
  const { setToken, token } = useContext(AdminContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "underline text-white font-semibold"
      : "hover:underline text-white";

  return (
    <nav className="bg-blue-500 text-white">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-2xl font-bold">Kumarakuru Tex</h2>
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        

        <div className="sm:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
        
        <div className="hidden sm:flex space-x-4">
          {token && (
            <>
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/place-dye-order" className={navLinkClass}>Place Order</NavLink>
              <NavLink to="/approve-dyer" className={navLinkClass}>Approve</NavLink>
              <NavLink to="/dyer-list" className={navLinkClass}>Dyers</NavLink>
              <NavLink to="/notification" className={navLinkClass}>Notification</NavLink>
              <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && token && (
        <div className="sm:hidden flex flex-col space-y-2 px-4 pb-4">
          <NavLink to="/" className={navLinkClass} onClick={toggleMenu}>Home</NavLink>
          <NavLink to="/place-dye-order" className={navLinkClass} onClick={toggleMenu}>Place Order</NavLink>
          <NavLink to="/approve-dyer" className={navLinkClass} onClick={toggleMenu}>Approve</NavLink>
          <NavLink to="/dyer-list" className={navLinkClass} onClick={toggleMenu}>Dyers</NavLink>
          <NavLink to="/notification" className={navLinkClass} onClick={toggleMenu}>Notification</NavLink>
          <NavLink to="/profile" className={navLinkClass} onClick={toggleMenu}>Profile</NavLink>
          <button onClick={() => { handleLogout(); toggleMenu(); }} className="hover:underline text-left">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
