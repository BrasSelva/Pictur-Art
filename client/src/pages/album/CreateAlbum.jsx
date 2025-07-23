import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/CreateAlbum.css';
import { apiForm } from '../../api/api';
import { getToken } from '../../utils/auth';

const CreateAlbumPage = () => {
  const [coverFile, setCoverFile] = useState(null);
  const [albumName, setAlbumName] = useState('');
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const handleCreateAlbum = async () => {
    if (!albumName.trim()) {
      setError("Le nom de l'album est requis.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nom', albumName);
      formData.append('date_creation', new Date().toISOString());
      formData.append('couverture', coverFile);

      const token = getToken(); // <--- récupère le token

      await apiForm.post('/albums', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      navigate('/albumPage');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de l'album.");
    }
  };

  const removeCover = () => {
    setCoverFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="create-album-container">
      <div className="create-album-wrapper">
        <h1 className="page-title">Créer un album</h1>

        <div className="content-wrapper">
          <div className="album-name-section">
            <label htmlFor="album-name" className="album-name-label">
              Nom de l'album :
            </label>
            <input
              type="text"
              id="album-name"
              className="album-name-input"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Entrez un nom d'album"
            />
            {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
          </div>

          <div className="two-column-layout">
            <label htmlFor="cover-upload" className="cover-photo-section">
              <div className="cover-upload-area">
                {!previewUrl ? (
                  <>
                    <div className="camera-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9ZM12 18C9.24 18 7 15.76 7 13C7 10.24 9.24 8 12 8C14.76 8 17 10.24 17 13C17 15.76 14.76 18 12 18ZM12 10C10.34 10 9 11.34 9 13C9 14.66 10.34 16 12 16C13.66 16 15 14.66 15 13C15 11.34 13.66 10 12 10Z" fill="#4A90E2" />
                      </svg>
                    </div>
                    <h3 className="cover-title">Ajouter une photo de couverture</h3>
                  </>
                ) : (
                  <div className="cover-preview-wrapper">
                    <img src={previewUrl} alt="Aperçu couverture" className="cover-preview-image" />
                    <button type="button" className="remove-cover-button" onClick={removeCover}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF3B30" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.3 5.71a1 1 0 00-1.42 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12l-4.89 4.89a1 1 0 101.41 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </label>

            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                setCoverFile(file);
                setPreviewUrl(file ? URL.createObjectURL(file) : null);
              }}
            />

            <div className="invite-section">
              <div className="invite-content">
                <h3 className="invite-title">Inviter des amis</h3>
                <p className="invite-description">
                  Ajoutez des collaborateurs pour qu'ils puissent aussi ajouter leurs photos
                </p>
                <button className="invite-button">
                  + Inviter des amis
                </button>
              </div>
              <div className="star-decoration">⭐</div>
            </div>
          </div>

          <button className="create-album-button" onClick={handleCreateAlbum}>
            Créer l'Album
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbumPage;
