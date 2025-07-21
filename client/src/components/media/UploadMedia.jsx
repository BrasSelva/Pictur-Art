import React, { useState } from 'react';
import api from '../../api/api';
import { getToken } from '../../utils/auth';

function UploadMedia({ id_album, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Merci de choisir un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('media', file);
    formData.append('id_album', id_album);

    try {
      const token = getToken();
      if (!token) {
        setMessage('Vous devez être connecté pour uploader.');
        return;
      }

      const res = await api.post('/medias/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // envoie token JWT au backend
        },
      });

      setMessage('Upload réussi !');
      setFile(null);
      if (onUploadSuccess) onUploadSuccess(res.data);
    } catch (err) {
      console.error('Erreur upload :', err.response || err.message || err);
      setMessage('Erreur lors de l’upload : ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input type="file" onChange={handleFileChange} accept="image/*,video/*" />
      <button type="submit" style={{ marginLeft: '1rem' }}>
        Envoyer
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default UploadMedia;
