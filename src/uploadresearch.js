import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ResearchPapers from "./researchpapers.js";
import axios from "axios";
import Navbar from './navbar';
import { handleLogout } from './handleLogout.js';
import "./UploadResearch.css";

function UploadResearch() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploadSubject, setUploadSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("myResearchPaper");
  const [sortBy, setSortBy] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [subject, setSubject] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("asc");

  const submitForm = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("subject", uploadSubject);
    formData.append("description", description);

    axios
      .post("/uploadresearch", formData)
      .then((res) => {
        setError("File uploaded");
      })
      .catch((err) => {
        console.error(err);
        setError("Error in uploading file");
      });
  };

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    axios
      .get("/subjects")
      .then((response) => {
        setSubjects(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleProfileClick = () => {
    navigate('/userprofile');
  };

  const handleuploadpage = () => {
    navigate('/uploadresearch');
  };

  return (
    <div>
      <Navbar
        handleuploadpage={handleuploadpage}
        handleProfileClick={handleProfileClick}
        handleLogout={() => handleLogout(navigate)}
      />
      <div className="uploadpage">
      <div className="uploadresearch">
        <form onSubmit={submitForm}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Upload Subject: </label>
            <select
              value={uploadSubject}
              onChange={(e) => setUploadSubject(e.target.value)}
            >
              <option value=""></option>
              {subjects.map((subj, index) => (
                <option key={index} value={subj.subjects}>
                  {subj.subjects}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="descriptioncontainer">
              <label>Description (Max 300 characters): </label>
              <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
            />
            </div>
          </div>
          <div>
            <label>File:</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <button className="uploadButton" type="submit">Upload</button>
          {error && <p>{error}</p>}
        </form>
      </div>
      <div className="myresearchpapers">
      <ResearchPapers
        search={search}
        mode={'myResearchPaper'}
        sortBy={'date'}
        sortOrder={'asc'}
        subject={'ALL'}
        handleSearch={handleSearch}
      />
      </div>
    </div>
    </div>
    
  );
}

export default UploadResearch;