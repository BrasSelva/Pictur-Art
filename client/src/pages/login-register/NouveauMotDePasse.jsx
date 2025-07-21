import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/LoginPage.css'; 
import api from '../../api/api'; 

const NouveauMotDePasse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = location.state || {}; // récupère email et code passés via navigate

  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  if (!email || !code) {
    return (
      <div className="text-center text-red-500 mt-10">
        Accès non autorisé. Veuillez recommencer la procédure de réinitialisation.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setMessage('');

    if (!nouveauMotDePasse || !confirmation) {
      setErreur("Tous les champs sont requis.");
      return;
    }

    if (nouveauMotDePasse !== confirmation) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await api.post('/utilisateurs/changerMotDePasse', {
        email,
        code,
        nouveauMotDePasse,
      });

      setMessage(response.data.message || "Mot de passe mis à jour.");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      setErreur(error?.response?.data?.message || "Une erreur est survenue.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md reset-container">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Réinitialiser le mot de passe</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={nouveauMotDePasse}
          onChange={(e) => setNouveauMotDePasse(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="w-full p-2 border rounded-md"
        />

        {erreur && <p className="text-red-500 text-sm">{erreur}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
        >
          Mettre à jour le mot de passe
        </button>
      </form>
    </div>
  );
};

export default NouveauMotDePasse;
