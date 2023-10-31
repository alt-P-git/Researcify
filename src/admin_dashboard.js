import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ResearchPapers from './researchpapers';
import { handleLogout } from './handleLogout.js';
import SearchFilter from './searchfilter';

function AdminDashboard() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dashboard', {
          method: 'GET'
        });
        if (response.status === 401) {
          navigate('/login');
        } else {
          const data = await response.json();
          setData(data);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      Hello! {data.firstname} {data.lastname}
      <SearchFilter />
      <ResearchPapers />
      <button onClick={() => handleLogout(navigate)}>Logout</button>
    </div>
  );
}

export default AdminDashboard;