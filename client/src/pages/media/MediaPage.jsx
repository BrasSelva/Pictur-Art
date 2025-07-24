import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import UploadButton from '../../components/media/UploadButton';
import { getToken, getUserIdFromToken } from '../../utils/auth';
import { FaUserCircle, FaLock, FaCommentDots, FaTrashAlt } from 'react-icons/fa';
import SearchBar from '../../components/searchbar/SearchBar';
import EmojiReactionButton from '../../components/media/EmojiReactionButton';
import '../../assets/css/MediaPage.css';
import '../../assets/css/SearchBar.css';

import InviteModal from '../../pages/media/InviteModal';


function MediaPage() {
  const { id_album } = useParams();
  const navigate = useNavigate();

  const [medias, setMedias] = useState([]);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reactionsMap, setReactionsMap] = useState({});
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAlbumModal, setShowDeleteAlbumModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const currentUserId = getUserIdFromToken();

  const fetchMedias = async () => {
    const token = getToken();
    const res = await api.get(`/medias/album/${id_album}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const mediasFetched = res.data;
    setMedias(mediasFetched);

    const newMap = {};
    for (let media of mediasFetched) {
      const r = await api.get(`/reactions/media/${media._id}`);
      newMap[media._id] = r.data;
    }
    setReactionsMap(newMap);
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

  const handleReact = async (mediaId, emojiId) => {
    const token = getToken();
  
    const reactions = reactionsMap[mediaId] || [];
    const currentUserReaction = reactions.find(r => r.id_utilisateur._id === currentUserId);
  
    try {
      // 👇 Si l'utilisateur a déjà réagi avec CE MÊME emoji => suppression
      if (currentUserReaction && currentUserReaction.id_emoji._id === emojiId) {
        await api.post('/reactions/toggle', { id_media: mediaId, id_emoji: emojiId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // 👇 Sinon (aucune réaction ou un emoji différent) => toggle normal
      else {
        // ⚠️ Supprimer l’ancienne réaction s’il y en a une
        if (currentUserReaction) {
          await api.post('/reactions/toggle', {
            id_media: mediaId,
            id_emoji: currentUserReaction.id_emoji._id
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        // Puis ajouter la nouvelle
        await api.post('/reactions/toggle', { id_media: mediaId, id_emoji: emojiId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      await fetchMedias(); // rechargement pour mise à jour
    } catch (err) {
      console.error('Erreur lors de la réaction :', err);
    }
  };
  

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="media-page-wrapper">
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

            <InviteModal albumId={id_album} /> {/* ← ce bouton apparaîtra avant celui-ci */}

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
          {medias.map((media) => {
            const reactions = reactionsMap[media._id] || [];
            const currentUserReaction = reactions.find(r => r.id_utilisateur._id === currentUserId);
            const otherReactions = reactions.filter(r => r.id_utilisateur._id !== currentUserId);

            return (
              <div key={media._id} className="media-card">
                {media.type_media === 'photo' ? (
                  <img
                    src={media.url}
                    alt="media"
                    onClick={() => setSelectedImage({ type: 'image', src: media.url })}
                  />
                ) : (
                  <video
                    src={media.url}
                    onClick={() => setSelectedImage({ type: 'video', src: media.url })}
                    muted
                    preload="metadata"
                    controls={false}
                  />
                )}

                <div className="media-info">
                  <p className="media-user"><FaUserCircle /> @{media.id_utilisateur?.nom || 'inconnu'}</p>

                  {currentUserReaction && (
                    <div className="user-reaction">Votre réaction : {currentUserReaction.id_emoji.emoji}</div>
                  )}

                  {otherReactions.length > 0 && (
                    <div className="others-reactions">
                      {otherReactions.map((r) => (
                        <span key={r._id} title={`@${r.id_utilisateur.nom}`}>
                          {r.id_emoji.emoji}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* ➕ Réaction */}
                  <EmojiReactionButton mediaId={media._id} onReact={handleReact} />

                  {/* Icônes */}
                  <div className="media-icons">
                    <FaCommentDots />
                    {media.id_utilisateur?._id?.toString() === currentUserId && (
                      <FaTrashAlt
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => {
                          setMediaToDelete(media._id);
                          setShowDeleteModal(true);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedImage && (
          <div className="lightbox" onClick={() => setSelectedImage(null)}>
            {selectedImage.type === 'image' ? (
              <img src={selectedImage.src} alt="zoom" />
            ) : (
              <video src={selectedImage.src} controls autoPlay />
            )}
          </div>
        )}

        {/* Confirmations modales */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Supprimer le média ?</h3>
              <p>Cette action est irréversible.</p>
              <div className="modal-actions">
                <button className="modal-cancel" onClick={() => { setShowDeleteModal(false); setMediaToDelete(null); }}>
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
