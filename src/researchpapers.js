import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { view } from "./view.js";
import SearchFilter from './searchfilter.js';
import "./ResearchPapers.css";

function ResearchPapers() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("researchPaper");
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
    <div className="researchPapers scrollable-container">
      <SearchFilter mode={mode} setMode={setMode} sortBy={sortBy} sortOrder={sortOrder} setSortOrder={setSortOrder} setSortBy={setSortBy} handleSearch={handleSearch} handleModeChange={handleModeChange} setSubject={setSubject} />
      {mode === "journal" ? (
        <div>
          <h1 className="journal-heading">Journals</h1>
          <p>{errorMessage}</p>
          {sortedList.map((journal) => {
            let date = new Date(journal.pub_date);
            let dateString = date.toISOString().split("T")[0];
            return (
              <div key={journal.journal_id} className="journal-container">
                <p>{journal.journal_name} | {journal.journal_title}</p>
                <p>Published on: {dateString} | Views: {journal.view_count}</p>
                <button onClick={() => view( journal.journal_id, "journal", displayErrorMessage, setErrorMessage )}>View</button>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <h1 className="research-heading">Research Papers</h1>
          <p>{errorMessage}</p>
          {sortedList.map((paper) => {
            let date = new Date(paper.pub_date);
            let dateString = date.toISOString().split("T")[0];
            return (
              <div key={paper.id} className="research-paper-container">
                <p>Id: {paper.id} | Title: {paper.title}</p>
                <p>Subject: {paper.subject}</p>
                <p>Description: {paper.description}</p>
                <p>Published on: {dateString} | Views: {paper.view_count}</p>
                {mode === "myResearchPaper" && (
                  <p>Peer review status: {paper.peer_review}</p>
                )}
                <button className="view-btn" onClick={() => view( paper.id, "researchpaper",displayErrorMessage, setErrorMessage)}>View</button>
                {mode === "myResearchPaper" && (
                  <button className="delete-btn" onClick={() => deleteFile(paper.id)}>Delete</button>
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