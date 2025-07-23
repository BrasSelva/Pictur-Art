import React from 'react';
import '../../assets/css/SearchBar.css';

function SearchBar({ search, setSearch, date, setDate, auteur, setAuteur, album, setAlbum }) {
  return (
    <aside className="search-filter-bar">
      <h3>🔍 Recherche</h3>
      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h4>📅 Par date</h4>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <h4>👤 Par créateur</h4>
      <input
        type="text"
        placeholder="Nom du créateur"
        value={auteur}
        onChange={(e) => setAuteur(e.target.value)}
      />

      <h4>🎞️ Par album</h4>
      <input
        type="text"
        placeholder="Nom de l'album"
        value={album}
        onChange={(e) => setAlbum(e.target.value)}
      />
    </aside>
  );
}

export default SearchBar;
