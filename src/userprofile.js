import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { handleLogout } from './handleLogout.js';
import Navbar from './navbar.js';
import './userprofile.css';

function UserProfile() {
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/userprofile', {
          method: 'GET'
        });
        if (response.status === 401) {
          navigate('/');
        } else {
          const data = await response.json();
          const userdata = data[0];
          setData(userdata);
          setUpdatedData(userdata);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);  

  const handleInputChange = (event) => {
    setUpdatedData({
      ...updatedData,
      [event.target.name]: event.target.value
    });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.post('/updateuser', updatedData);
      if (response.status === 200) {
        setData(updatedData);
        setEditMode(false);
        handleLogout(navigate);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="userprofilepage">
      <Navbar />
      <div className="userprofile-container">
        {editMode ? (
          <div className="edit-mode">
            <p>Firstname: <input type="text" name="firstname" value={updatedData.firstname} onChange={handleInputChange} /></p>
            <p>Lastname: <input type="text" name="lastname" value={updatedData.lastname} onChange={handleInputChange} /></p>
            <p>Email id: <input type="email" name="email" value={updatedData.email} onChange={handleInputChange} /></p>
            <p>Password <input type="password" name="password" value={updatedData.password} onChange={handleInputChange} /></p>
            <button id='submit_button' onClick={handleEditSubmit}>Submit</button>
          </div>
        ) : (
          <div className="view-mode">
            <p>Firstname: {data.firstname}</p>
            <p>Lastname: {data.lastname}</p>
            <p>Email id: {data.email}</p>
            <button id='edit_button' onClick={() => setEditMode(true)}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;