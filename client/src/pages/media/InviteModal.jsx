import React, { useState } from 'react';
import api from '../../api/api'; // On utilise la même instance que MediaPage
import '../../assets/css/InviteModal.css';

const InviteModal = ({ albumId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [message, setMessage] = useState('');

  const handleInvite = async () => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Utilisateur non connecté');
        return;
      }

      // Vérifier si l'utilisateur existe via son pseudo
      const userRes = await api.get(`/utilisateurs/by-pseudo/${pseudo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const utilisateur = userRes.data;

      // Envoyer l'invitation
      const res = await api.post(
        `/membrealbums`,
        { id_utilisateur: utilisateur._id, id_album: albumId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        setMessage('Invitation envoyée !');
        setPseudo('');
      } else {
        setMessage(res.data.message || 'Erreur');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setMessage('Utilisateur introuvable');
      } else if (err.response && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Erreur réseau');
      }
    }
  };

  return (
    <>
      <button className="Invite-btn" onClick={() => setIsOpen(true)}>
        Inviter des amis
      </button>

      {isOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Inviter un ami</h3>
            <input
              type="text"
              placeholder="Pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
            />
            <button onClick={handleInvite}>Envoyer l’invitation</button>
            <button onClick={() => setIsOpen(false)}>Fermer</button>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default InviteModal;
