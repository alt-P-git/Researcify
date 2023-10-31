import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './login';
import Register from './register';
import ResearchPapers from "./researchpapers";
import UploadResearch from "./uploadresearch";
import UploadJournal from "./uploadjournal";
import ReviewPaperlist from "./reviewpaperlist";
import PublisherDashboard from "./publisher_dashboard";
import Publisher_Journals from "./publisher_journals";
import AdminDashboard from "./admin_dashboard";
import UserProfile from "./userprofile";
import LandingPage from "./landingpage";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/register' element={<Register />} />
        <Route path='/researchpapers' element={<ResearchPapers />} />
        <Route path='/uploadresearch' element={<UploadResearch />} />
        <Route path='/reviewpaperlist' element={<ReviewPaperlist />} />
        <Route path='/publisher_dashboard' element={<PublisherDashboard />} />
        <Route path='/uploadjournal' element={<UploadJournal />} />
        <Route path='/publisher_journals' element={<Publisher_Journals />} />
        <Route path='/admin_dashboard' element={<AdminDashboard />} />
        <Route path='/userprofile' element={<UserProfile />} />
        <Route path='/' element={<LandingPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);