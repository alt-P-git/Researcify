import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleLogout } from "./handleLogout.js";
import { view } from "./view.js";
import "./ReviewPaperlist.css"; // Import the CSS file

function ReviewPaperlist() {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [researchPaperList, setResearchPaperList] = useState([]);
  const [subject, setSubject] = useState("ALL");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false); // State to toggle advanced search

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

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    axios.get('/subjects')
      .then(response => {
        setSubjects(response.data || []); // Ensure subjects is set to an array
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
      });
  }, []);

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
      <div className="scrollable-container">
        <div className="search-bar">
          <input
            type="text"
            onKeyDown={handleSearch}
            placeholder="Search..."
            className="search-input"
          />
          {showAdvancedSearch && (
            <>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map((subj, index) => (
                <option key={index} value={subj.subjects}>
                  {subj.subjects}
                </option>
              ))}
            </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort by</option>
                <option value="title">Title</option>
                <option value="pub_date">Date_Time</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </>
          )}
        </div>
        <button onClick={() => setShowAdvancedSearch(!showAdvancedSearch)} className="advanced-search-button" >
          {showAdvancedSearch ? "Hide Advanced Search" : "Show Advanced Search"}
        </button>
        <div>
          <h1 className="research-heading">Research Papers</h1>
          <p className="error-message">{errorMessage}</p>
          {sortedResearchPaperList.map((paper) => (
            <div key={paper.id} className="research-paper-container">
              <h3>{paper.title}</h3>
              <p>Subject: {paper.subject}</p>
              <p>Description: {paper.description}</p>
              <button
                className="view-button"
                onClick={() =>
                  view(
                    paper.id,
                    "researchpaper",
                    errorMessage,
                    setErrorMessage
                  )
                }
              >
                View
              </button>
              <button
                className="accept-button"
                onClick={() => handleReview(paper.id, "accepted")}
              >
                Accept
              </button>
              <button
                className="reject-button"
                onClick={() => handleReview(paper.id, "rejected")}
              >
                Reject
              </button>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => handleLogout(navigate)}>Logout</button>
    </div>
  );
}

export default ReviewPaperlist;