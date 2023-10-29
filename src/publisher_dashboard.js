import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
/* import ResearchPapers from './researchpapers';
import UploadResearch from './uploadresearch'; */
import UploadJournal from './uploadjournal';

function PublisherDashboard() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/publisher_dashboard', {
          method: 'GET'
        });
        if (response.status === 401) {
          // Not authenticated, redirect to login
          navigate('/');
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

  const handleLogout = async () => {
    try {
      const response = await axios.get('/logout');
      if (response.status === 200) {
        console.log('Logout successful');
        // Clear the session cookie
        document.cookie = 'connect.user_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        sessionStorage.clear();
        localStorage.clear();
  
        navigate('/');//navigating back to login page
      } else {
        console.error('Failed to logout:', response.data.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="dashboard">
      Hello! {data.journal_name}
      {/* <ResearchPapers />
      <UploadResearch /> */}
      <UploadJournal />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default PublisherDashboard;