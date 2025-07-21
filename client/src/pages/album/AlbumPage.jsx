import React, { useEffect, useState } from 'react';
import '../../assets/css/AlbumPage.css';
import api from '../../api/api'; 

function AlbumPage() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await api.get('/albums'); 
        setAlbums(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des albums:', error);
      }
    };

    fetchAlbums();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="album-container">
      <h2>Mes Albums</h2>
      <div className="albums-grid">
        {albums.map((album) => (
          <div key={album._id} className="album-card">
            <div className="image-placeholder"></div>
            <p className="album-name">🔒 {album.nom}</p>
            <p className="album-date">{formatDate(album.date_creation)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlbumPage;
