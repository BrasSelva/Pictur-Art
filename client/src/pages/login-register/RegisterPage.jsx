import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api'; 
import '../../assets/css/RegisterPage.css'; 
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterPage() {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validateFields = () => {
    if (pseudo.length < 3) {
      setMessage("Le pseudo doit contenir au moins 3 caractères.");
      return false;
    }
    if (email.length < 5) {
      setMessage("L'email doit contenir au moins 5 caractères.");
      return false;
    }
    const mdpRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!mdpRegex.test(motDePasse)) {
      setMessage("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateFields()) return;

    try {
      await api.post('/utilisateurs', {
        nom: pseudo,
        email,
        mot_de_passe: motDePasse
      });

      setTimeout(() => {
        navigate('/login', { state: { successMessage: "Votre compte a bien été créé !" } });
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);

      if (error.response && error.response.status === 409) {
        setMessage("Ce mail est déjà utilisé.");
      } else {
        setMessage("Une erreur est survenue lors de la création du compte.");
      }
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
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            className="input-style"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

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
