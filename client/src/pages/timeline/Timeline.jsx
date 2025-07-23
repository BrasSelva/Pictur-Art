import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { getToken, getUserIdFromToken } from '../../utils/auth';
import { FaUserCircle, FaCommentDots } from 'react-icons/fa';
import '../../assets/css/MediaPage.css';

function Timeline() {
  const [medias, setMedias] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState(null);

  const currentUserId = getUserIdFromToken();

  const fetchTimeline = async () => {
    const token = getToken();
    const res = await api.get('/medias/timeline', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMedias(res.data);
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const handlePrev = () => {
    setSlideDirection('left');
    setSelectedIndex((prevIndex) => (prevIndex - 1 + medias.length) % medias.length);
  };

  const handleNext = () => {
    setSlideDirection('right');
    setSelectedIndex((prevIndex) => (prevIndex + 1) % medias.length);
  };

  const selectedMedia = medias[selectedIndex];

  return (
    <div className="media-container">
      <header className="media-header">
        <div className="header-content">
          <h2 className="page-title">Fil d'actualité</h2>
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
              </div>
            </div>
            <p className="media-album" style={{ fontSize: '0.85rem', color: '#666' }}>
              Album : {media.album?.nom || 'Inconnu'}
            </p>
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
            {selectedMedia.type_media === 'photo' ? (
              <img src={selectedMedia.url} alt="zoom" />
            ) : (
              <video src={selectedMedia.url} controls autoPlay />
            )}
          </div>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>❮</button>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>❯</button>
        </div>
      )}
    </div>
  );
}

export default Timeline;
