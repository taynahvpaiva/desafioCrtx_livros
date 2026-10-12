import React, { useState } from 'react';

export function ExtraFeature({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="search-filter-container">
      <form onSubmit={handleSubmit} className="search-box">
        <input
          type="text"
          placeholder="Procurar título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="btn-search">
          Pesquisar
        </button>
      </form>
    </div>
  );
}