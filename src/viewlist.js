import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { view } from "./view.js";
import SearchFilter from './searchfilter.js';

function ResearchPapers() {

  return (
    <div className="researchPapers">
      Hello! {data.firstname} {data.lastname}
      {/* Use the new component */}
      <SearchFilter 
        mode={mode}
        setMode={setMode}
        subject={subject}
        setSubject={setSubject}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        handleSearch={handleSearch}
      />
    </div>
  );
}

export default Dashboard;