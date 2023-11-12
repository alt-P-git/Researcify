import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchFilter from "./searchfilter.js";
import ResearchPapers from "./researchpapers.js";
import Navbar from './navbar';
import { handleLogout } from './handleLogout.js';
import './Dashboard.css';

function Dashboard() {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("researchPaper");
  const [sortBy, setSortBy] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  //const [rawList, setRawList] = useState([]);
  const [subject, setSubject] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSearch = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dashboard', {
          method: 'GET',
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

  const handleProfileClick = () => {
    navigate('/userprofile');
  };

  const handleuploadpage = () => {
    navigate('/uploadresearch');
  };

  return (
    <div className="dashboard">
      <Navbar
        handleuploadpage={handleuploadpage}
        handleProfileClick={handleProfileClick}
        handleLogout={() => handleLogout(navigate)}
      />
      <div >
      <SearchFilter
        mode={mode}
        setMode={setMode}
        sortBy={sortBy}
        sortOrder={sortOrder}
        subject={subject}
        setSortOrder={setSortOrder}
        setSortBy={setSortBy}
        handleSearch={handleSearch}
        setSubject={setSubject}
      />
      <ResearchPapers
        search={search}
        mode={mode}
        sortBy={sortBy}
        sortOrder={sortOrder}
        subject={subject}
        setSortOrder={setSortOrder}
        setSortBy={setSortBy}
        handleSearch={handleSearch}
        setSubject={setSubject}
        setmode={setMode}
      />
      </div>
    </div>
  );
}

export default Dashboard;