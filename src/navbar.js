import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { handleLogout } from './handleLogout';
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/userprofile">Profile</Link>
      <Link to="/uploadresearch">Upload</Link>
      <button onClick={handleLogoutClick}>Logout</button>
    </nav>
  );
};

export default Navbar;