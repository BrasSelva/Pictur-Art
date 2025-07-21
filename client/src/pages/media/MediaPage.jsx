import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { FaUserCircle, FaLock, FaCommentDots } from 'react-icons/fa';
import '../../assets/css/MediaPage.css';

function MediaPage() {
  const { id_album } = useParams();
  const [medias, setMedias] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        const res = await api.get(`/medias/album/${id_album}`);
        setMedias(res.data);
      } catch (err) {
        console.error('Erreur chargement médias:', err);
      }
    };

    fetchMedias();
  }, [id_album]);

  return (
    <>
      <div className="media-grid">
        {medias.map((media) => (
          <div key={media._id} className="media-card">
            <img
              src={media.url}
              alt="media"
              onClick={() => setSelectedImage(media.url)}
              style={{ cursor: 'pointer' }}
            />
            <div className="media-info">
              <p className="media-user">
                <FaUserCircle /> @{media.id_utilisateur?.nom || 'inconnu'}
              </p>
              <p className="media-album">
                <FaLock /> {media.id_album?.nom || 'inconnu'}
              </p>
              <div className="media-icons">
                <FaCommentDots />
              </div>
              <p className="media-date">
                Publié le {new Date(media.date_publication).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="zoom" />
        </div>
      )}
    </>
  );
}

export default MediaPage;
