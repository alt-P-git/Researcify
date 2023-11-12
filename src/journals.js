import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleLogout } from "./handleLogout.js";

function Journals() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("myJournal");
  const [sortby, setSortby] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [journalList, setJournalList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/journalList", {
          search: search,
          mode: mode,
          sortby: sortby,
        });
        if (response.status === 401) {
          handleLogout(navigate);
        } else {
          setJournalList(response.data);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    fetchData();
  }, [search, mode, sortby]);

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      setSearch(event.target.value);
    }
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  return (
    <div className="journals">
      <select value={mode} onChange={handleModeChange}>
        <option value="myJournal">My Journals</option>
        <option value="journals">Journals</option>
      </select>
      <input type="text" onKeyDown={handleSearch} placeholder="Search..." />
      {journalList.map((journal) => (
        <div key={journal.journal_id}>
          <h2>{journal.journal_name}</h2>
          <p>{journal.journal_title}</p>
        </div>
      ))}
    </div>
  );
}

export default Journals;