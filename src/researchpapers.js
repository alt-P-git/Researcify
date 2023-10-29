import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { view } from "./view.js";

function ResearchPapers() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("myResearchPaper");
  const [sortBy, setSortBy] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rawList, setRawList] = useState([]);
  const [subject, setSubject] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  const displayErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/researchPaperList", {
          search: search,
          mode: mode,
          subject: subject,
        });
        if (response.status === 201) {
          displayErrorMessage("Nothing found");
          setRawList([]);
        } else {
          setRawList(response.data);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    fetchData();
  }, [search, mode, subject]);

  const sortedList = [...rawList].sort((a, b) => {
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

  const deleteFile = async (paperid) => {
    try {
      const response = await axios.delete(`/deleteFile/researchpaper/${paperid}`);
      if (response.status === 200) {
        const updatedList = rawList.filter((paper) => paper.id !== paperid);
        setRawList(updatedList);
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
          <p>{errorMessage}</p>
          {sortedList.map((journal) => {
            let date = new Date(journal.pub_date);
            let dateString = date.toISOString().split("T")[0];
            return (
              <div key={journal.journal_id}>
                <h2>{journal.journal_name}</h2>
                <p>{journal.journal_title}</p>
                <p>Published on: {dateString}</p>
                <button
                  onClick={() =>
                    view(
                      journal.journal_id,
                      "journal",
                      displayErrorMessage,
                      setErrorMessage
                    )
                  }
                >
                  View
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <h1>Research Papers</h1>
          <p>{errorMessage}</p>
          {sortedList.map((paper) => {
            let date = new Date(paper.pub_date);
            let dateString = date.toISOString().split("T")[0];
            return (
              <div key={paper.id}>
                <h2>Id: {paper.id}</h2>
                <p>Title: {paper.title}</p>
                <p>Subject: {paper.subject}</p>
                <p>Published on: {dateString}</p>
                <button onClick={() => view( paper.id, "researchpaper",displayErrorMessage, setErrorMessage)}>View</button>
                {mode === "myResearchPaper" && (
                  <button onClick={() => deleteFile(paper.id)}>Delete</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ResearchPapers;