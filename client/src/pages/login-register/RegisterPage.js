import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api'; 
import '../../assets/css/RegisterPage.css'; 

function RegisterPage() {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/utilisateurs', {
        nom: pseudo,
        email,
        mot_de_passe: motDePasse
      });

      
      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/login', { state: { successMessage: "Votre compte a bien été créé !" } });

      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setMessage("Erreur lors de la création du compte.");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <img src="img/logoLogin.png" alt="Logo Pictur'Art" className="logo" />
        <h1 className="title">Créer un compte</h1>

        <label>Pseudo</label>
        <input
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Mot de passe</label>
        <input
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />

        <button type="submit" className="btn-orange">Inscription</button>

        {message && <p className="register-message">{message}</p>}

        <p className="switch-text">Vous avez déjà un compte ?</p>
        <button type="button" className="btn-blue" onClick={() => navigate('/login')}>
          Connexion
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
