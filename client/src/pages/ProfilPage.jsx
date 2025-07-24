import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../assets/css/Profil.css';

const ProfilPage = () => {
  const [utilisateur, setUtilisateur] = useState({ });
  const [ancienMotDePasse, setAncienMotDePasse] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [edition, setEdition] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfil = async () => {
      try {
          const userString = localStorage.getItem('user');
          const user = userString ? JSON.parse(userString) : null;
          const token = user?.token;
        if (!token) return navigate('/login');

        setUtilisateur(user);
      } catch (error) {
        console.error("Erreur récupération profil :", error);
      }
    };

    fetchProfil();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setErreur('');

    if (!utilisateur.nom.trim()) return setErreur("Le pseudo est requis.");

    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const email = user.email;  
      const mdpRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!mdpRegex.test(nouveauMotDePasse) || !mdpRegex.test(confirmation)) {
        setMessage("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.");
        return false;
      }    
      const res = await api.put('/utilisateurs/modifier', {
        nom: utilisateur.nom,
        ancienMotDePasse,
        nouveauMotDePasse,
        confirmation,
        email
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setMessage(res.data.message);
      setAncienMotDePasse('');
      setNouveauMotDePasse('');
      setConfirmation('');
      setEdition(false);
    } catch (err) {
      console.error(err);
      setErreur(err?.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="profil-container">
      <h2>Mon profil</h2>

      {!edition ? (
        <div className="profil-affichage">
          <p><strong>Pseudo :</strong> {utilisateur.nom}</p>
          <p><strong>Email :</strong> {utilisateur.email}</p>
          <p><strong>Mot de passe :</strong> *************</p>

          <button onClick={() => setEdition(true)}>Modifier mon profil</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <label>Pseudo</label>
          <input
            type="text"
            value={utilisateur.nom}
            onChange={(e) => setUtilisateur({ ...utilisateur, nom: e.target.value })}
            required
          />

          <label>Ancien mot de passe</label>
          <input
            type="password"
            placeholder="Ancien mot de passe"
            value={ancienMotDePasse}
            onChange={(e) => setAncienMotDePasse(e.target.value)}
          />

          <label>Nouveau mot de passe</label>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={nouveauMotDePasse}
            onChange={(e) => setNouveauMotDePasse(e.target.value)}
          />

          <label>Confirmation</label>
          <input
            type="password"
            placeholder="Confirmation"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />

          {erreur && <p className="erreur">{erreur}</p>}
          {message && <p className="message">{message}</p>}

          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => setEdition(false)}>Annuler</button>
        </form>
      )}
    </div>
  );
};

export default ProfilPage;
