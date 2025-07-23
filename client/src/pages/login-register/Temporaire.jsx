import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import '../../assets/css/LoginPage.css'; 
import api from '../../api/api';

const Temporaire = () => {
  const [code, setCode] = useState('');
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const [email, setEmail] = useState(emailFromState);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setMessage('');

    if (!email || !code) {
      setErreur("Tous les champs sont requis.");
      return;
    }

    try {
      const response = await api.post('/utilisateurs/verifier-code', {
        email,
        code,
      });

      if (response.data.success) {
        // Redirige vers la page de mise à jour avec les infos nécessaires
        navigate('/nouveau-mot-de-passe', {
          state: { email, code },
        });
      } else {
        setErreur("Code invalide.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      setErreur("Erreur lors de la vérification.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow reset-container">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Vérification du code</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Code temporaire"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {erreur && <p className="text-red-500 text-sm">{erreur}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
        >
          Vérifier le code
        </button>
      </form>
    </div>
  );
};

export default Temporaire;
