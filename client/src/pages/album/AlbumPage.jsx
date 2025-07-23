import React, { useEffect, useState } from 'react';
import '../../assets/css/AlbumPage.css';
import '../../assets/css/SearchBar.css';
import api from '../../api/api';
import { apiForm } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/searchbar/SearchBar';
import '../../assets/css/SearchBar.css';
import { getUserIdFromToken } from '../../utils/auth';


function AlbumPage() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [erreur, setErreur] = useState('');

  // 🧠 Filtres
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [auteur, setAuteur] = useState('');
  const [album, setAlbum] = useState('');
  const userIdConnecte = getUserIdFromToken();


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

  // 🔍 Filtrage côté front (optionnel, sinon à brancher avec l’API)
  const filteredAlbums = albums.filter((albumItem) => {
    const matchSearch = albumItem.nom.toLowerCase().includes(search.toLowerCase());
    const matchDate = !date || new Date(albumItem.date_creation).toISOString().startsWith(date);
    const matchAuteur = !auteur || (albumItem.id_utilisateur?.nom || '').toLowerCase().includes(auteur.toLowerCase());
    const matchNom = !album || albumItem.nom.toLowerCase().includes(album.toLowerCase());
    return matchSearch && matchDate && matchAuteur && matchNom;
  });

  return (
    <div className="album-page-wrapper" style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <SearchBar
        search={search}
        setSearch={setSearch}
        date={date}
        setDate={setDate}
        auteur={auteur}
        setAuteur={setAuteur}
        album={album}
        setAlbum={setAlbum}
      />

      <div className="album-container" style={{ flex: 1 }}>
        <div className="album-header">
          <div className="header-content">
            <h2 className="page-title">Mes Albums</h2>
            {albums.length > 0 && (
            <button
                className="create-album-btn"
                onClick={() => navigate('/createAlbum')}
              >
                <span className="btn-icon"></span>
                Créer un album privé
              </button>
            )}
        </div>
  
      </div>

        {erreur && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {erreur}
          </div>
        )}

        {filteredAlbums.length === 0 && !erreur ? (
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
            {filteredAlbums.map((album) => (
              <div
                key={album._id}
                className="album-card"
                onClick={() => navigate(`/album/${album._id}/medias`)}
                style={{ cursor: 'pointer' }}
              >
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
                      <span>{formatDate(album.date_creation)}</span>
                    </div>

                  <div className="album-author">
                    <span className="detail-icon">👤</span>
                    <span>{album.id_utilisateur?.nom || 'Inconnu'}</span>
                  </div>
                </div>
                {album.id_utilisateur?._id === userIdConnecte && (
                  <div className="album-footer">
                    <button
                      className="private-badge"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCoverChange(album._id);
                      }}
                    >
                      <span className="badge-icon"></span>
                      Modifier la couverture
                    </button>
                  </div>
                )}



              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlbumPage;
