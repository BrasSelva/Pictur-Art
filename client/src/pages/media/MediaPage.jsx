import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import UploadButton from '../../components/media/UploadButton';
import { getToken, getUserIdFromToken } from '../../utils/auth';
import { FaUserCircle, FaCommentDots, FaTrashAlt } from 'react-icons/fa';
import SearchBar from '../../components/searchbar/SearchBar';
import EmojiReactionButton from '../../components/media/EmojiReactionButton';
import MediaLightbox from '../../components/media/MediaLightbox';
import '../../assets/css/MediaPage.css';
import '../../assets/css/SearchBar.css';
import InviteModal from './InviteModal';

  function MediaPage() {
    const { id_album } = useParams();
    const navigate = useNavigate();
    const currentUserId = getUserIdFromToken();

    const [medias, setMedias] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mediaToDelete, setMediaToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteAlbumModal, setShowDeleteAlbumModal] = useState(false);
    const [showQuitAlbumModal, setShowQuitAlbumModal] = useState(false);
    const [slideDirection, setSlideDirection] = useState(null);
    const [reactionsMap, setReactionsMap] = useState({});
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');
    const [auteur, setAuteur] = useState('');
    const [albumFilter, setAlbumFilter] = useState('');
    


  const fetchMedias = async () => {
    try {
      const token = getToken();
      const res = await api.get(`/medias/album/${id_album}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mediasFetched = res.data;
      setMedias(mediasFetched);

      const map = {};
      await Promise.all(
        mediasFetched.map(async (media) => {
          const r = await api.get(`/reactions/media/${media._id}`);
          map[media._id] = r.data;
        })
      );
      setReactionsMap(map);
    } catch (err) {
      console.error('Erreur lors du chargement des médias:', err);
    }
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

  const handleReact = async (mediaId, emojiId) => {
    await fetchMedias(); // Recharge toutes les réactions à jour
  };

  const filteredMedias = medias.filter((media) => {
    const matchesSearch = search === '' || media.nom?.toLowerCase().includes(search.toLowerCase());
    const matchesDate = date === '' || media.date?.startsWith(date);
    const matchesAuteur = auteur === '' || media.id_utilisateur?.nom?.toLowerCase().includes(auteur.toLowerCase());
    const matchesAlbum = albumFilter === '' || album?.nom?.toLowerCase().includes(albumFilter.toLowerCase());
    return matchesSearch && matchesDate && matchesAuteur && matchesAlbum;
  });

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

      <div className="media-container">
        <header className="media-header">
          <div className="header-content">
            <h2 className="page-title">{album?.nom || 'Album'}</h2>
            <UploadButton id_album={id_album} onUploadSuccess={(media) => setMedias((prev) => [media, ...prev])} />

            {album?.id_utilisateur?.toString() === currentUserId && (
              <>
                <InviteModal albumId={id_album} />
                <button
                  className="modal-confirm"
                  style={{ background: 'crimson', color: 'white' }}
                  onClick={() => setShowDeleteAlbumModal(true)}
                >
                  Supprimer l'album
                </button>
              </>
            )}
          </div>
        </header>

        <div className="media-grid">
          {filteredMedias.map((media) => {
            const reactions = reactionsMap[media._id] || [];
            const currentUserReaction = reactions.find(r => r.id_utilisateur._id === currentUserId);
            const otherReactions = reactions.filter(r => r.id_utilisateur._id !== currentUserId);

            return (
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

                <div className="media-info">
                  <p className="media-user"><FaUserCircle /> @{media.id_utilisateur?.nom || 'Inconnu'}</p>

                  {currentUserReaction && (
                    <div className="user-reaction">
                      Votre réaction : {currentUserReaction.id_emoji.emoji}
                    </div>
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

                  <EmojiReactionButton mediaId={media._id} onReact={handleReact} />

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
            );
          })}
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
          {showQuitAlbumModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Quitter l'album ?</h3>
                <p>Vous ne pourrez plus accéder à cet album.</p>
                <div className="modal-actions">
                  <button className="modal-cancel" onClick={() => setShowQuitAlbumModal(false)}>
                    Annuler
                  </button>
                  <button
                    className="modal-confirm"
                    onClick={async () => {
                      try {
                        const token = getToken();
                        await api.delete('/membrealbums', {
                          headers: { Authorization: `Bearer ${token}` },
                          data: {
                            id_album,
                            id_utilisateur: currentUserId
                          },
                        });
                        navigate('/albumPage');
                      } catch (err) {
                        console.error(err.response?.data || err.message);
                        alert("Erreur lors de la tentative de quitter l'album.");
                      }
                    }}
                  >
                    Quitter l’album
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
