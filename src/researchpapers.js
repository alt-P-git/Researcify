import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResearchPapers() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("myResearchPaper");
  const [sortBy, setSortBy] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [researchPaperList, setResearchPaperList] = useState([]);
  const [subject, setSubject] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/researchPaperList", {
          search: search,
          mode: mode,
          /* sortBy: sortBy, */
          subject: subject,
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
    fetchData();
  }, [search, mode/* , sortBy */, subject]);

  const sortedResearchPaperList = [...researchPaperList].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      setSearch(event.target.value);
    }
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const deleteResearchPaper = async (paperid) => {
    try {
      const response = await axios.delete(`/deleteResearchPaper/${paperid}`);
      if (response.status === 200) {
        const updatedPapers = researchPaperList.filter(
          (paper) => paper.id !== paperid
        );
        setResearchPaperList(updatedPapers);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const viewResearchPaper = async (paperId) => {
    try {
      const response = await axios.get(`/viewResearchPaper/${paperId}`, { responseType: 'blob' });
      if (response.status === 200) {
        setErrorMessage("")
        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("target", "_blank");
        fileLink.click();
      }
    } catch (error) {
      if (error.response.status === 404) {
        setErrorMessage("File not found");
      }
      else if (error.response.status === 500) {
        setErrorMessage("Server error")
      }
      else {
        console.error("An error occurred:", error);
      }
    }
  };  
  

  return (
    <div className="researchPapers">
      <select value={mode} onChange={handleModeChange}>
        <option value="myResearchPaper">My Research Papers</option>
        <option value="researchPaper">Research Papers</option>
        <option value="journal">Journals</option>
      </select>
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
      <input type="text" onKeyDown={handleSearch} placeholder="Search..." />
      {mode === "journal" ? (
        <div>
          <h1>Journals</h1>
          <h2>{errorMessage}</h2>
          {researchPaperList.map((journal) => (
            <div key={journal.journal_id}>
              <h2>{journal.journal_name}</h2>
              <p>{journal.journal_title}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h1>Research Papers</h1>
          <h2>{errorMessage}</h2>
          {sortedResearchPaperList.map((paper) => (
            <div key={paper.id}>
              <h2>Id: {paper.id}</h2>
              <p>Title: {paper.title}</p>
              <p>Subject: {paper.subject}</p>
              <button onClick={() => viewResearchPaper(paper.id)}>View</button>
              {mode === "myResearchPaper" && (
                <button onClick={() => deleteResearchPaper(paper.id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResearchPapers;