import React, { useState } from 'react';
import axios from 'axios';
import './uploadjournal.css';

const UploadJournal = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const submitForm = (e) => {
    //e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    axios.post('/uploadjournal', formData)
      .then(res => {
        setError("File uploaded");
      })
      .catch(err => {
        console.error(err);
        setError("Error in uploading file");
      });
  };

  return (
    <form className='uploadjournalform' onSubmit={submitForm}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default UploadJournal;