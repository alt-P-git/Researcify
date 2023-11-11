import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { view } from "./view.js";
import "./ResearchPapers.css"; // Import the CSS file

function Publisher_Journals() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rawList, setRawList] = useState([]);
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
        const response = await axios.post("/myJournals", {
          search: search,
          mode: "journals",
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
  }, [search]);

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

  const deleteFile = async (journalid) => {
    try {
      const response = await axios.delete(`/deleteFile/journal/${journalid}`);
      if (response.status === 200) {
        const updatedList = rawList.filter((paper) => paper.journal_id !== journalid);
        setRawList(updatedList);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="researchPapers">
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
      <div className="scrollable-container">
        <h1 className="journal-heading">Journals</h1>
        <p>{errorMessage}</p>
        {sortedList.map((journal) => {
          let date = new Date(journal.pub_date);
          let dateString = date.toISOString().split("T")[0];
          return (
            <div className="journal-container" key={journal.journal_id}>
              <h2>{journal.journal_name}</h2>
              <p>{journal.journal_title}</p>
              <p>Published on: {dateString}</p>
              <p>Views: {journal.view_count}</p>
              <button className="view-btn" onClick={() => view(journal.journal_id,  "journal", displayErrorMessage, setErrorMessage)}>View</button>
              <button className="delete-btn" onClick={() => deleteFile(journal.journal_id)}>Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Publisher_Journals;