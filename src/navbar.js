import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { handleLogout } from './handleLogout';
import logo from './icon.png';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  return (
    <nav className="navbar">
      <div className="navbarleft">
      <img src={logo} alt="Researcify Logo" className="logo" />
      <div className="navbarlefttext">
        Researcify
      </div>
      </div>
      <div className="navbarright">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/userprofile">Profile</Link>
      <Link to="/uploadresearch">Upload</Link>
      <button onClick={handleLogoutClick}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;