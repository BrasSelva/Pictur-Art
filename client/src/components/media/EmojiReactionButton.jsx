import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { getToken } from '../../utils/auth';
import '../../assets/css/EmojiReactionButton.css';

const EmojiReactionButton = ({ mediaId, onReact }) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [emojis, setEmojis] = useState([]);

  const toggleEmojiList = () => {
    setShowEmojis((prev) => !prev);
  };

  const handleEmojiClick = (emojiId) => {
    onReact(mediaId, emojiId);
    setShowEmojis(false);
  };

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
      <button className="emoji-toggle-btn" onClick={toggleEmojiList}>
        +
      </button>

      {showEmojis && (
        <div className="emoji-list">
          {emojis.map((emoji) => (
            <span
              key={emoji._id}
              className="emoji-item"
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
