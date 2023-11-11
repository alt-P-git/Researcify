import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './navbar.css';

const Navbar = ({ handleProfileClick, handleLogout }) => {
  return (
    <nav className="navbar">
      <button onClick={handleProfileClick}>Profile</button>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

Navbar.propTypes = {
  handleProfileClick: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default Navbar;