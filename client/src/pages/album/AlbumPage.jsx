import React, { useEffect, useState } from 'react';
import '../../assets/css/AlbumPage.css';
import api from '../../api/api';
import { apiForm } from '../../api/api';
import { useNavigate } from 'react-router-dom';

function AlbumPage() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
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
      setErreur("Erreur lors du chargement des albums.");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleCoverChange = async (albumId) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('couverture', file);

      try {
        await apiForm.patch(`/albums/${albumId}/couverture`, formData);
        fetchAlbums();
      } catch (err) {
        console.error('Erreur lors de la mise à jour de la couverture :', err);
      }
    };
    fileInput.click();
  };

  return (
    <div className="album-container">
      <div className="album-header">
        <div className="header-content">
          <h2 className="page-title">Mes Albums</h2>
          <button 
            className="create-album-btn" 
            onClick={() => navigate('/createAlbum')}
          >
            <span className="btn-icon"></span>
            Créer un album privé
          </button>
        </div>
      </div>

      {erreur && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {erreur}
        </div>
      )}

      {albums.length === 0 && !erreur ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3 className="empty-title">Aucun album trouvé</h3>
          <p className="empty-description">Créez votre premier album pour commencer !</p>
          <button 
            className="empty-cta-btn"
            onClick={() => navigate('/createAlbum')}
          >
            Créer mon premier album
          </button>
        </div>
      ) : (
        <div className="albums-grid">
          {albums.map((album) => (
            <div key={album._id} className="album-card">
              <div className="album-cover-container">
                {album.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${album.image}`}
                    alt="Couverture"
                    className="album-cover"
                  />
                ) : (
                  <div className="image-placeholder">
                    <div className="placeholder-icon">📸</div>
                  </div>
                )}
                <div className="lock-overlay">
                  <div className="lock-icon">🔒</div>
                </div>
              </div>

              <div className="album-content">
                <h3 className="album-name">{album.nom}</h3>

                <div className="album-details">
                  <div className="album-date">
                    <span className="detail-icon">📅</span>
                    <span>Date de création : {formatDate(album.date_creation)}</span>
                  </div>

                  <div className="album-author">
                    <span className="detail-icon">👤</span>
                    <span>{album.id_utilisateur?.nom || 'Inconnu'}</span>
                  </div>
                </div>

                <div className="album-footer">
                  <span className="private-badge">
                    <span className="badge-icon">🔒</span>
                    Privé
                  </span>
                  <button onClick={() => handleCoverChange(album._id)} style={{ marginLeft: '10px', fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>
                    🖼️ Modifier la couverture
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlbumPage;
