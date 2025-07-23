import React, { useState } from "react";

const InviteModal = ({ albumId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    try {
      const res = await fetch(`/api/albums/${albumId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ pseudo }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Invitation envoyée !");
        setPseudo("");
      } else {
        setMessage(data.message || "❌ Erreur");
      }
    } catch (err) {
      setMessage("❌ Erreur réseau");
    }
  };

  return (
    <>
      <button
        className="create-album-btn"
        style={{ position: "fixed", top: "1rem", right: "1rem" }}
        onClick={() => setIsOpen(true)}
      >
        <span className="btn-icon"></span>
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
