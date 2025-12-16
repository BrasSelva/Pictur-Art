import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { getToken, getUserIdFromToken } from '../../utils/auth';
import '../../assets/css/EmojiReactionButton.css';

const EmojiReactionButton = ({ mediaId, onReact }) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [emojis, setEmojis] = useState([]);
  const [currentUserReactionId, setCurrentUserReactionId] = useState(null);
  const currentUserId = getUserIdFromToken();

  const toggleEmojiList = () => {
    setShowEmojis((prev) => !prev);
  };

  const fetchCurrentUserReaction = async () => {
    try {
      const res = await api.get(`/reactions/media/${mediaId}`);
      const userReaction = res.data.find(r => r.id_utilisateur._id === currentUserId);
      setCurrentUserReactionId(userReaction?.id_emoji._id || null);
    } catch (err) {
      console.error("Erreur chargement réaction utilisateur :", err);
    }
  };

  const handleEmojiClick = async (emojiId) => {
    const token = getToken();
    const isSameEmoji = emojiId === currentUserReactionId;

    try {
      if (isSameEmoji) {
        // Supprimer réaction
        await api.post('/reactions/toggle', { id_media: mediaId, id_emoji: emojiId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserReactionId(null);
      } else {
        // Supprimer ancienne réaction
        if (currentUserReactionId) {
          await api.post('/reactions/toggle', { id_media: mediaId, id_emoji: currentUserReactionId }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        // Ajouter nouvelle
        await api.post('/reactions/toggle', { id_media: mediaId, id_emoji: emojiId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserReactionId(emojiId);
      }

      onReact(mediaId, emojiId); // met à jour les réactions affichées
      setShowEmojis(false);
    } catch (err) {
      console.error("Erreur lors de la réaction :", err);
    }
  };

  useEffect(() => {
    fetchCurrentUserReaction();
  }, [mediaId]);

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const token = getToken();
        const res = await api.get('/emojis', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmojis(res.data);
      } catch (err) {
        console.error('Erreur chargement emojis :', err);
      }
    };
    fetchEmojis();
  }, []);

  return (
    <div className="emoji-reaction-wrapper">
      <button className="emoji-toggle-btn" onClick={toggleEmojiList}>+</button>

      {showEmojis && (
        <div className="emoji-list">
          {emojis.map((emoji) => (
            <span
              key={emoji._id}
              className={`emoji-item ${emoji._id === currentUserReactionId ? 'selected' : ''}`}
              onClick={() => handleEmojiClick(emoji._id)}
              title={emoji.libelle}
            >
              {emoji.emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiReactionButton;
