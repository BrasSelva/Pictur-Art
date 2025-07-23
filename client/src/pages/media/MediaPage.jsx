  import React, { useEffect, useState } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import api from '../../api/api';
  import UploadButton from '../../components/media/UploadButton';
  import { getToken, getUserIdFromToken } from '../../utils/auth';
  import { FaUserCircle, FaLock, FaCommentDots, FaTrashAlt } from 'react-icons/fa';
  import '../../assets/css/MediaPage.css';

  function MediaPage() {
    const { id_album } = useParams();
    const navigate = useNavigate();

    const [medias, setMedias] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mediaToDelete, setMediaToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteAlbumModal, setShowDeleteAlbumModal] = useState(false);
    const [slideDirection, setSlideDirection] = useState(null);

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
          navigate('/albumPage');
        }
      };

      verifierAcces();
    }, [id_album, navigate]);

    const handleDelete = async () => {
      if (!mediaToDelete) return;
      try {
        const token = getToken();
        if (!token) throw new Error('Non connecté');

        await api.delete(`/medias/${mediaToDelete}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMedias((prev) => prev.filter((m) => m._id !== mediaToDelete));
        setShowDeleteModal(false);
        setMediaToDelete(null);
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    };

    const selectedMedia = medias[selectedIndex];
    const handlePrev = () => {
      setSlideDirection('left');
      setSelectedIndex((prevIndex) => (prevIndex - 1 + medias.length) % medias.length);
    };

    const handleNext = () => {
      setSlideDirection('right');
      setSelectedIndex((prevIndex) => (prevIndex + 1) % medias.length);
    };


    if (loading) return <p>Chargement...</p>;

    return (
      <>
        <div className="media-container">
          <header className="media-header">
            <div className="header-content">
              <h2 className="page-title">{album?.nom || 'Album inconnu'}</h2>
              <UploadButton id_album={id_album} onUploadSuccess={(media) => setMedias((prev) => [media, ...prev])} />
              {album?.id_utilisateur?.toString() === currentUserId && (
                <button
                  className="modal-confirm"
                  style={{ background: 'crimson', color: 'white' }}
                  onClick={() => setShowDeleteAlbumModal(true)}
                >
                  Supprimer l'album
                </button>
              )}
            </div>
          </header>

          <div className="media-grid">
            {medias.map((media, i) => (
              <div key={media._id} className="media-card">
                {media.type_media === 'photo' ? (
                  <img
                    src={media.url}
                    alt="media"
                    onClick={() => setSelectedIndex(i)}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <video
                    src={media.url}
                    onClick={() => setSelectedIndex(i)}
                    style={{ cursor: 'pointer', maxHeight: '200px' }}
                    muted
                    preload="metadata"
                    controls={false}
                  />
                )}
                <div className="media-info" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p className="media-user">
                    <FaUserCircle /> @{media.id_utilisateur?.nom || 'inconnu'}
                  </p>
                  <div className="media-icons">
                    <FaCommentDots />
                    {media.id_utilisateur?._id?.toString() === currentUserId && (
                      <FaTrashAlt
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => {
                          setMediaToDelete(media._id);
                          setShowDeleteModal(true);
                        }}
                        title="Supprimer ce média"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedIndex !== null && (
            <div className="lightbox" onClick={() => setSelectedIndex(null)}>
              <div
                className={`slide-media ${slideDirection}`}
                key={medias[selectedIndex]._id}
                onClick={(e) => e.stopPropagation()}
              >
                {medias[selectedIndex].type_media === 'photo' ? (
                  <img src={medias[selectedIndex].url} alt="zoom" />
                ) : (
                  <video src={medias[selectedIndex].url} controls autoPlay />
                )}
              </div>
              <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>❮</button>
              <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>❯</button>
            </div>
          )}

          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Supprimer le média ?</h3>
                <p>Cette action est irréversible.</p>
                <div className="modal-actions">
                  <button
                    className="modal-cancel"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setMediaToDelete(null);
                    }}
                  >
                    Annuler
                  </button>
                  <button className="modal-confirm" onClick={handleDelete}>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteAlbumModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Supprimer l'album ?</h3>
                <p>Cette action supprimera également tous les médias associés.</p>
                <div className="modal-actions">
                  <button className="modal-cancel" onClick={() => setShowDeleteAlbumModal(false)}>
                    Annuler
                  </button>
                  <button
                    className="modal-confirm"
                    onClick={async () => {
                      try {
                        const token = getToken();
                        await api.delete(`/albums/${id_album}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        navigate('/albumPage');
                      } catch (err) {
                        alert("Erreur lors de la suppression de l'album.");
                        setShowDeleteAlbumModal(false);
                      }
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  export default MediaPage;
