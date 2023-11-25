import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { handleLogout } from './handleLogout.js';

function LandingPage() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/landingpage', {
          method: 'GET'
        });
        if (response.status === 401) {
          navigate('/');
        } else {
          const data = await response.json();
          setData(data[0]);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="landingpage">
        <p>Registered users: {data.usercnt}</p>
        <p>Research papers: {data.researchcnt}</p>
        <p>Journals: {data.journalcnt}</p>
        <p><Link to="/login">Login</Link></p>
        <p><Link to="/register">Register</Link></p>
    </div>
    
  );
}

export default LandingPage;