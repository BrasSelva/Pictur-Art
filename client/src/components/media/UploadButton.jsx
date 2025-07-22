import React, { useRef, useState, useEffect } from 'react';
import api from '../../api/api';
import { getToken } from '../../utils/auth';
import '../../assets/css/UploadButton.css';

function UploadButton({ id_album, onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessage('');

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
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Upload réussi !');
      if (onUploadSuccess) onUploadSuccess(res.data);
      e.target.value = null; // reset input
    } catch (err) {
      console.error('Erreur upload :', err.response || err.message || err);
      setMessage('Erreur lors de l’upload : ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <button
        className="upload-float-button"
        onClick={handleClick}
        aria-label="Uploader un média"
        type="button"
      >
        +
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {message && <p className="upload-message">{message}</p>}
    </>
  );
}

export default UploadButton;
