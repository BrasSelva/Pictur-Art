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

function MediaPage() {
  const { id_album } = useParams();
  const navigate = useNavigate();
  const currentUserId = getUserIdFromToken();

  const [medias, setMedias] = useState([]);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reactionsMap, setReactionsMap] = useState({});
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [auteur, setAuteur] = useState('');
  const [albumFilter, setAlbumFilter] = useState('');

  const fetchMedias = async () => {
    const token = getToken();
    const res = await api.get(`/medias/album/${id_album}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const mediasFetched = res.data;
    setMedias(mediasFetched);

    // Charger les réactions pour chaque média
    const map = {};
    await Promise.all(
      mediasFetched.map(async (media) => {
        const r = await api.get(`/reactions/media/${media._id}`);
        map[media._id] = r.data;
      })
    );
    setReactionsMap(map);
  };

  useEffect(() => {
    const verifierAcces = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('Non connecté');

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

  const handleReact = async (mediaId) => {
    await fetchMedias(); // recharge les réactions pour tous les médias
  };

  const handleDelete = async () => {
    try {
      const token = getToken();
      await api.delete(`/medias/${mediaToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchMedias();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
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
    <div className="media-page-wrapper" style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      
      {/* Barre de recherche */}
      <div style={{ minWidth: '300px' }}>
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
      </div>

      {/* Contenu principal */}
      <div className="media-container" style={{ flex: 1 }}>
        <div className="media-header">
          <div className="header-content">
            <h2 className="page-title">{album?.nom || 'Album inconnu'}</h2>
            <UploadButton id_album={id_album} onUploadSuccess={() => fetchMedias()} />
          </div>
        </div>

        <div className="media-grid">
          {filteredMedias.map((media) => {
            const reactions = reactionsMap[media._id] || [];
            const currentUserReaction = reactions.find(r => r.id_utilisateur._id === currentUserId);
            const otherReactions = reactions.filter(r => r.id_utilisateur._id !== currentUserId);

            return (
              <div key={media._id} className="media-card">
                {media.type_media === 'photo' ? (
                  <img src={media.url} alt="media" onClick={() => setSelectedMedia(media)} />
                ) : (
                  <video src={media.url} muted preload="metadata" onClick={() => setSelectedMedia(media)} />
                )}

                <div className="media-info">
                  <p className="media-user"><FaUserCircle /> @{media.id_utilisateur?.nom || 'Inconnu'}</p>

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

                  <EmojiReactionButton mediaId={media._id} onReact={handleReact} />

                  <div className="media-icons">
                    <FaCommentDots style={{ cursor: 'default' }} />
                    {media.id_utilisateur?._id === currentUserId && (
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

        {selectedMedia && (
          <MediaLightbox
            media={selectedMedia}
            onClose={() => setSelectedMedia(null)}
            currentUserId={currentUserId}
          />
        )}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Supprimer le média ?</h3>
              <p>Cette action est irréversible.</p>
              <div className="modal-actions">
                <button className="modal-cancel" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                <button className="modal-confirm" onClick={handleDelete}>Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaPage;
