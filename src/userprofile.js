import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { handleLogout } from './handleLogout.js';

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
          const userdata = data[0]; // Get the user data from the response
          setData(userdata); // Set data to userdata
          setUpdatedData(userdata); // Set updatedData to userdata
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
    <div className="userprofile">
      {editMode ? (
        <div>
          <input type="text" name="firstname" value={updatedData.firstname} onChange={handleInputChange} />
          <input type="text" name="lastname" value={updatedData.lastname} onChange={handleInputChange} />
          <input type="email" name="email" value={updatedData.email} onChange={handleInputChange} />
          <input type="password" name="password" value={updatedData.password} onChange={handleInputChange} />
          <button onClick={handleEditSubmit}>Submit</button>
        </div>
      ) : (
        <div>
          <p>Firstname: {data.firstname}</p>
          <p>Lastname: {data.lastname}</p>
          <p>Emailid: {data.email}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;