import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResearchPapers from './researchpapers';
import { handleLogout } from './handleLogout.js';
import SearchFilter from './searchfilter';
import './admindashboard.css';

function AdminDashboard() {
  const [data, setData] = useState({});
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("researchPaper");
  const [sortBy, setSortBy] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [subject, setSubject] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("asc");
  const [userForm, setUserForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [publisherForm, setPublisherForm] = useState({
    journal_name: '',
    email: '',
    password: '',
  });

  const handleSearch = (value) => {
    setSearch(value);
  };

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dashboard', {
          method: 'GET',
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
  }, [navigate]);

  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  const handleUserFormChange = (event) => {
    setUserForm({
      ...userForm,
      [event.target.name]: event.target.value,
    });
  };

  const handlePublisherFormChange = (event) => {
    setPublisherForm({
      ...publisherForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/adduser', userForm);
      if (response.status === 200) {
        alert('User added successfully!');
        setUserForm({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Email already registered');
        setTimeout(() => {
          setError(null);
        }, 2000);
      } else {
        console.error('An error occurred:', error);
      }
    }
  };

  const handleAddPublisher = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/addpublisher', publisherForm);
      if (response.status === 200) {
        alert('Publisher added successfully!');
        setPublisherForm({
          journal_name: '',
          email: '',
          password: '',
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Email already registered');
        setTimeout(() => {
          setError(null);
        }, 2000);
      } else {
        console.error('An error occurred:', error);
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="add-forms">
        <div className="add-user-form">
          <h2>Add User</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleAddUser}>
            <p><label>
              First Name:
              <input
                type="text"
                name="firstname"
                value={userForm.firstname}
                onChange={handleUserFormChange}
              />
            </label></p>
            <p><label>
              Last Name:
              <input
                type="text"
                name="lastname"
                value={userForm.lastname}
                onChange={handleUserFormChange}
              />
            </label></p>
            <p><label>
              Email:
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleUserFormChange}
              />
            </label></p>
            <p><label>
              Password:
              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleUserFormChange}
              />
            </label></p>
            <button type="submit">Add User</button>
          </form>
        </div>

        <div className="add-publisher-form">
          <h2>Add Publisher</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleAddPublisher}>
            <p><label>
              Journal Name:
              <input
                type="text"
                name="journal_name"
                value={publisherForm.journal_name}
                onChange={handlePublisherFormChange}
              />
            </label></p>
            <p><label>
              Email:
              <input
                type="email"
                name="email"
                value={publisherForm.email}
                onChange={handlePublisherFormChange}
              />
            </label></p>
            <p><label>
              Password:
              <input
                type="password"
                name="password"
                value={publisherForm.password}
                onChange={handlePublisherFormChange}
              />
            </label></p>
            <button type="submit">Add Publisher</button>
          </form>
        </div>
      </div>

      <div className="research-paper-list">
        <SearchFilter
        mode={mode}
        setMode={setMode}
        sortBy={sortBy}
        sortOrder={sortOrder}
        subject={subject}
        setSortOrder={setSortOrder}
        setSortBy={setSortBy}
        handleSearch={handleSearch}
        setSubject={setSubject} />
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
        setmode={setMode} />
      </div>
    </div>
  );
}

export default AdminDashboard;