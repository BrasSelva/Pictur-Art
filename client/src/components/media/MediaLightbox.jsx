import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { getToken } from '../../utils/auth';
import '../../assets/css/Lightbox.css';
import { FaTrash } from 'react-icons/fa';

function MediaLightbox({ media, onClose, currentUserId, handlePrev, handleNext, slideDirection }) {
  const [commentaires, setCommentaires] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchCommentaires = async () => {
    try {
      const res = await api.get(`/commentaires/media/${media._id}`);
      setCommentaires(res.data);
    } catch (err) {
      console.error("Erreur chargement commentaires", err);
    }
  };

  const handlePostComment = async () => {
    const token = getToken();
    if (!newComment.trim()) return;

    try {
      await api.post('/commentaires', {
        id_media: media._id,
        contenu: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewComment('');
      fetchCommentaires();
    } catch (err) {
      console.error("Erreur ajout commentaire", err);
    }
  };

  useEffect(() => {
    fetchCommentaires();
  }, [media._id]);

  return (
    <div className="lightbox">
      <div
        className={`slide-media ${slideDirection}`}
        onClick={(e) => e.stopPropagation()}
      >
        {media.type_media === 'photo' ? (
          <img src={media.url} alt="zoom" />
        ) : (
          <video src={media.url} controls autoPlay />
        )}
      </div>

      <button className="lightbox-arrow lightbox-prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
        &#x25C0;
      </button>
      <button className="lightbox-arrow lightbox-next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
        &#x25B6;
      </button>


      <div className="lightbox-comments">
        <h3>Commentaires</h3>
        <div className="comments-list">
          {commentaires.map((c) => (
            <div key={c._id} className="comment">
              <strong>@{c.id_utilisateur.nom}</strong> : {c.contenu}
              {c.id_utilisateur._id === currentUserId && (
                <button
                  onClick={async () => {
                    try {
                      const token = getToken();
                      await api.delete(`/commentaires/${c._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      fetchCommentaires();
                    } catch (err) {
                      console.error("Erreur suppression commentaire", err);
                    }
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e3342f', marginLeft: '8px' }}
                  title="Supprimer le commentaire"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="comment-form">
          <textarea
            placeholder="Écris un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button onClick={handlePostComment}>Envoyer</button>
        </div>

        <button className="close-lightbox" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default MediaLightbox;
