import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { view } from "./view.js";
import { handleLogout } from "./handleLogout.js";
import SearchFilter from './searchfilter.js';
import "./ResearchPapers.css";

function ResearchPapers({
  search,
  mode,
  sortBy,
  sortOrder,
  subject,
  setSortOrder,
  setSortBy,
  handleSearch,
  setSubject,
  setMode,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [rawList, setRawList] = useState([]);
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
        if (error.response.status === 401) {
          handleLogout(navigate);
        }
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
                <button onClick={() => view( journal.journal_id, "journal", displayErrorMessage, setErrorMessage, navigate )}>View</button>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <h1 className="research-heading">{mode === "myResearchPaper" ? "My Research Papers" : "Research Papers"}</h1>
          <p>{errorMessage}</p>
          {sortedList.map((paper) => {
            let date = new Date(paper.pub_date);
            let dateString = date.toISOString().split("T")[0];
            return (
              <div key={paper.id} className="research-paper-container">
                <p>Id: {paper.id} | Title: {paper.title}</p>
                <p>Subject: {paper.subject} | Description: {paper.description}</p>
                <p>Published on: {dateString} | Views: {paper.view_count}</p>
                {mode === "myResearchPaper" && (
                  <p>Peer review status: {paper.peer_review}</p>
                )}
                <button className="view-btn" onClick={() => view( paper.id, "researchpaper",displayErrorMessage, setErrorMessage, navigate)}>View</button>
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