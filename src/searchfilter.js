import React from 'react';

function SearchFilter({ mode, setMode, subject, setSubject, sortBy, setSortBy, sortOrder, setSortOrder, handleSearch }) {
  return (
    <div>
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="myResearchPaper">My Research Papers</option>
        <option value="researchPaper">Research Papers</option>
        <option value="journal">Journals</option>
      </select>
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="ALL">ALL</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="ME">ME</option>
      </select>
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
    </div>
  );
}

export default SearchFilter;