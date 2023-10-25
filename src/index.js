import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './login';
import Register from './register';
import ResearchPapers from "./researchpapers";
import UploadResearch from "./uploadresearch";
import ReviewPaperlist from "./reviewpaperlist";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/register' element={<Register />} />
        <Route path='/researchpapers' element={<ResearchPapers />} />
        <Route path='/uploadresearch' element={<UploadResearch />} />
        <Route path='/reviewpaperlist' element={<ReviewPaperlist />} />
      </Routes>
    </Router>
  </React.StrictMode>
);