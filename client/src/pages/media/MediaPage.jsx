import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import UploadButton from '../../components/media/UploadButton';
import { getToken, getUserIdFromToken } from '../../utils/auth';
import { FaUserCircle, FaLock, FaCommentDots, FaTrashAlt } from 'react-icons/fa';
import SearchBar from '../../components/searchbar/SearchBar';
import '../../assets/css/MediaPage.css';
import '../../assets/css/SearchBar.css';

import InviteModal from '../../pages/media/InviteModal';


function MediaPage() {
  const { id_album } = useParams();
  const navigate = useNavigate();

  const [medias, setMedias] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAlbumModal, setShowDeleteAlbumModal] = useState(false);

  const currentUserId = getUserIdFromToken();

  // 🔎 Filtres
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [auteur, setAuteur] = useState('');
  const [albumFilter, setAlbumFilter] = useState('');

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
      console.error('Erreur suppression media :', err);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="media-page-wrapper" style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <SearchBar
        search={search}
        setSearch={setSearch}
        date={date}
        setDate={setDate}
        auteur={auteur}
        setAuteur={setAuteur}
        album={albumFilter}
        setAlbum={setAlbumFilter}
      />

      <div className="media-container" style={{ flex: 1 }}>
        <header className='media-header'>
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

        <div className="header-content">
          <button className="Invite-btn">
            <span className="btn-icon"></span>
            <InviteModal albumId={id_album} />
          </button>
        </div>

        <div className="media-grid">
          {medias
            .filter((media) => {
              const matchSearch = media.url.toLowerCase().includes(search.toLowerCase());
              const matchDate = !date || new Date(media.date_publication).toISOString().startsWith(date);
              const matchAuteur = !auteur || (media.id_utilisateur?.nom || '').toLowerCase().includes(auteur.toLowerCase());
              const matchAlbum = !albumFilter || (album?.nom || '').toLowerCase().includes(albumFilter.toLowerCase());
              return matchSearch && matchDate && matchAuteur && matchAlbum;
            })
            .map((media) => (
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
                  <p className="media-user" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FaUserCircle /> @{media.id_utilisateur?.nom || 'inconnu'}
                  </p>
                  <div className="media-icons" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FaCommentDots style={{ cursor: 'default' }} />
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

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Supprimer le média ?</h3>
              <p>Cette action est irréversible.</p>
              <div className="modal-actions">
                <button className="modal-cancel" onClick={() => { setShowDeleteModal(false); setMediaToDelete(null); }}>
                  Annuler
                </button>
                <button className="modal-confirm" style={{ color: 'white', background: 'red', marginLeft: 12 }} onClick={handleDelete}>
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
                <button className="modal-cancel" onClick={() => setShowDeleteAlbumModal(false)}>Annuler</button>
                <button className="modal-confirm" onClick={async () => {
                  try {
                    const token = getToken();
                    await api.delete(`/albums/${id_album}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    navigate('/albumPage');
                  } catch (err) {
                    console.error("Erreur suppression album:", err);
                    alert("Erreur lors de la suppression de l'album.");
                    setShowDeleteAlbumModal(false);
                  }
                }}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaPage;
