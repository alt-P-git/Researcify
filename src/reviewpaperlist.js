import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const viewResearchPaper = async (paperId) => {
    try {
      const response = await axios.get(`/viewResearchPaper/${paperId}`, {
        responseType: "blob",
      });
      if (response.status === 200) {
        setErrorMessage("");
        const fileURL = window.URL.createObjectURL(
          new Blob([response.data], { type: response.headers["content-type"] })
        );
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("target", "_blank");
        fileLink.click();
      }
    } catch (error) {
      if (error.response.status === 404) {
        setErrorMessage("File not found");
      } else if (error.response.status === 500) {
        setErrorMessage("Server error");
      } else {
        console.error("An error occurred:", error);
      }
    }
  };

  const handleReview = async (paperId, decision) => {
    try {
      const response = await axios.post(`/reviewResearchPaper/${paperId}`, {
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

  const handleLogout = async () => {
    try {
      const response = await axios.get("/logout");
      if (response.status === 200) {
        console.log("Logout successful");
        // Clear the session cookie
        document.cookie =
          "connect.user_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        sessionStorage.clear();
        localStorage.clear();

        navigate("/"); //navigating back to login page
      } else {
        console.error("Failed to logout:", response.data.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
            <button onClick={() => viewResearchPaper(paper.id)}>View</button>
            <button onClick={() => handleReview(paper.id, "accepted")}>
              Accept
            </button>
            <button onClick={() => handleReview(paper.id, "rejected")}>
              Reject
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default ResearchPapers;
