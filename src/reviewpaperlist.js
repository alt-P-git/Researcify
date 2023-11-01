import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleLogout } from './handleLogout.js';
import { view } from "./view.js";

function ResearchPapers() {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [researchPaperList, setResearchPaperList] = useState([]);
  const [subject, setSubject] = useState("ALL");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.post("/reviewPaperList", {
        search: search,
        subject: subject,
        sortBy: sortBy,
      });
      if (response.status === 201) {
        setErrorMessage("Nothing found");
        setResearchPaperList([]);
      } else {
        setErrorMessage("");
        setResearchPaperList(response.data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, subject]);

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      setSearch(event.target.value);
    }
  };

  const sortedResearchPaperList = [...researchPaperList].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const handleReview = async (paperId, decision) => {
    try {
      const response = await axios.post(`/review/${paperId}`, {
        decision,
      });
      if (response.status === 200) {
        setErrorMessage("");
        fetchData();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response && error.response.status === 500) {
        setErrorMessage("Server error");
      }
    }
  };

  return (
    <div className="researchPapers">
      <input type="text" onKeyDown={handleSearch} placeholder="Search..." />
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="ALL">ALL</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="ME">ME</option>
      </select>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Sort by</option>
        <option value="title">Title</option>
        <option value="pub_date">Date_Time</option>
      </select>
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <div>
        <h1>Research Papers</h1>
        <p>{errorMessage}</p>
        {sortedResearchPaperList.map((paper) => (
          <div key={paper.id}>
            <p>Title: {paper.title}</p>
            <p>Subject: {paper.subject}</p>
            <button onClick={() => view( paper.id, "researchpaper",errorMessage, setErrorMessage)}>View</button>
            <button onClick={() => handleReview(paper.id, "accepted")}>
              Accept
            </button>
            <button onClick={() => handleReview(paper.id, "rejected")}>
              Reject
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => handleLogout(navigate)}>Logout</button>
    </div>
  );
}

export default ResearchPapers;