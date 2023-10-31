import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { view } from "./view.js";
import SearchFilter from './searchfilter.js';

// ... rest of your code ...

function ResearchPapers() {
  // ... rest of your code ...

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
      {/* ... rest of your code ... */}
    </div>
  );
}

export default Dashboard;
