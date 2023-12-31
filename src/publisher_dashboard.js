import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import UploadJournal from './uploadjournal';
import Publisher_Journals from './publisher_journals';
import { handleLogout } from './handleLogout.js';
import './publisherdashboard.css';

function PublisherDashboard() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dashboard', {
          method: 'GET'
        });
        if (response.status === 401) {
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

  return (
    <div className="publisher_dashboard">
      <div className="uploadjournalcontainer">
        <UploadJournal />
        <button onClick={() => handleLogout(navigate)}>Logout</button>
      </div>
      <div className="journalscontainer">
        <Publisher_Journals />
      </div>
    </div>
  );
}

export default PublisherDashboard;