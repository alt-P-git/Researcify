import React, { useState } from 'react';
import axios from 'axios';

const UploadResearch = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");

  const submitForm = (e) => {
    //e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('subject', subject);

    axios.post('/uploadresearch', formData)
      .then(res => {
        setError("File uploaded");
      })
      .catch(err => {
        console.error(err);
        setError("Error in uploading file");
      });
  };

  return (
    <form onSubmit={submitForm}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">Select a subject</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="ME">ME</option>
      </select>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default UploadResearch;