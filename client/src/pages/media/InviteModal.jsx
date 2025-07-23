import React, { useState } from 'react';

const InviteModal = ({ albumId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    setMessage("");
    try {
      const token = localStorage.getItem("token");

      // Étape 1 : récupérer utilisateur par pseudo
      const userRes = await fetch(`/api/utilisateurs/by-pseudo/${pseudo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) {
        setMessage("Utilisateur introuvable");
        return;
      }

      const utilisateur = await userRes.json();

      // Étape 2 : ajouter à l'album
      const res = await fetch(`/api/membrealbums`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_utilisateur: utilisateur._id,
          id_album: albumId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Invitation envoyée !");
        setPseudo("");
      } else {
        setMessage(data.message || "Erreur");
      }
    } catch (err) {
      setMessage("Erreur réseau");
    }
  };

  return (
    <>
      <button
        className="Invite-btn"
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
        onClick={() => setIsOpen(true)}
      >
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