import React, { useEffect, useState } from 'react';
import '../../assets/css/AlbumPage.css';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function AlbumPage() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [nouvelAlbum, setNouvelAlbum] = useState('');
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await api.get('/albums');
      setAlbums(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des albums:', error);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
  };

  const handleCreateAlbum = async () => {
    try {
      await api.post('/albums', {
        nom: 'Nouvel Album',
        date_creation: new Date(),
      });
      fetchAlbums();
    } catch (error) {
      console.error('Erreur création album:', error);
      setErreur("Erreur lors de la création de l'album.");
    }
  };

  return (
    <div className="album-container">
      <div className="album-header">
        <h2>Mes Albums</h2>
        <div className="album-create">
            <button onClick={() => navigate('/createAlbum')}>Créer un album privé</button>
        </div>
      </div>

      {erreur && <p className="album-error">{erreur}</p>}

      {albums.length === 0 ? (
        <p>Aucun album trouvé.</p>
      ) : (
        <div className="albums-grid">
          {albums.map((album) => (
            <div key={album._id} className="album-card">
              <div className="image-placeholder"></div>
              <p className="album-name">🔒 <strong>{album.nom}</strong></p>
              <p className="album-date">{formatDate(album.date_creation)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlbumPage;
