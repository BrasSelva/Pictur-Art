import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import UploadButton from '../../components/media/UploadButton';
import { getToken, getUserIdFromToken } from '../../utils/auth'; // getUser pour l'id utilisateur
import { FaUserCircle, FaLock, FaCommentDots, FaTrashAlt } from 'react-icons/fa';
import '../../assets/css/MediaPage.css';

function MediaPage() {
  const { id_album } = useParams();
  const navigate = useNavigate();

  const [medias, setMedias] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUserId = getUserIdFromToken();

  const fetchMedias = async () => {
    const token = getToken();
    const res = await api.get(`/medias/album/${id_album}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMedias(res.data);
  };

  useEffect(() => {
    const verifierAcces = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('Non connecté');

        await api.get(`/medias/album/${id_album}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const albumRes = await api.get(`/albums/${id_album}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlbum(albumRes.data);

        await fetchMedias();

        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          navigate('/albumPage');
        } else {
          navigate('/albumPage');
        }
      }
    };

    verifierAcces();
  }, [id_album, navigate]);

  const handleDelete = async (mediaId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce média ?')) return;

    try {
      const token = getToken();
      if (!token) throw new Error('Non connecté');

      await api.delete(`/medias/${mediaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMedias((prev) => prev.filter((m) => m._id !== mediaId));
    } catch (err) {
      console.error('Erreur suppression media :', err);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <>
      <header className='media-header'>
        <h1>{album?.nom || 'Album inconnu'}</h1>
      </header>

      <UploadButton id_album={id_album} onUploadSuccess={(media) => setMedias((prev) => [media, ...prev])} />

      <div className="media-grid">
        {medias.map((media) => (
          <div key={media._id} className="media-card">
            {media.type_media === 'photo' ? (
              <img
                src={media.url}
                alt="media"
                onClick={() => setSelectedImage({ type: 'image', src: media.url })}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <video
                src={media.url}
                onClick={() => setSelectedImage({ type: 'video', src: media.url })}
                style={{ cursor: 'pointer', maxHeight: '200px' }}
                muted
                preload="metadata"
                controls={false}
              />
            )}
            <div className="media-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Gauche : utilisateur */}
              <p className="media-user" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FaUserCircle /> @{media.id_utilisateur?.nom || 'inconnu'}
              </p>

              {/* Droite : commentaires + poubelle */}
              <div className="media-icons" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FaCommentDots style={{ cursor: 'default' }} />
                {media.id_utilisateur?._id?.toString() === currentUserId && (
                  <FaTrashAlt
                    style={{ cursor: 'pointer', color: 'red' }}
                    onClick={() => handleDelete(media._id)}
                    title="Supprimer ce média"
                  />
                )}
              </div>
            </div>
          </div>

        ))}
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          {selectedImage.type === 'image' ? (
            <img src={selectedImage.src} alt="zoom" />
          ) : (
            <video
              src={selectedImage.src}
              controls
              autoPlay
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            />
          )}
        </div>
      )}

    </>
  );
}

export default MediaPage;
