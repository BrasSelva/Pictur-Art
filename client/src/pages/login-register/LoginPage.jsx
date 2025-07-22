import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/LoginPage.css'; 
import api from '../../api/api'; 
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const successMessage = location.state?.successMessage;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
        const response = await api.post('/utilisateurs/login', {
          email,
          mot_de_passe: password,  // important, car backend attend mot_de_passe
        });
        
        const user = {
          nom: response.data.utilisateur.nom,
          email: response.data.utilisateur.email,
          token: response.data.token
        };

        // Stocker dans localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Optionnel : tu peux utiliser response.data si tu veux
        setTimeout(() => {
          navigate('/albumPage', { state: { successMessage: "Vous êtes connecté !" } });
        }, 1000);
      } catch (error) {
        console.error("Erreur lors de la tentative de connexion:", error);

        if (error.response && error.response.status === 401) {
          setMessage("Email ou mot de passe incorrect.");
        } else {
          setMessage("Une erreur est survenue lors de la connexion.");
        }
      }
    };

  return (
    <div className="login-container">
      <div className="left-section">
        <img src="img/logoLogin.png" alt="Logo Pictur'Art" className="logo" />
        <h1>
          <span>Pictur</span><span>'Art</span>
        </h1>
        <h2>Avec Pictur'Art, vos souvenirs restent<br /> entre les bonnes mains : les vôtres.</h2>
        <p>Connectez-vous pour les retrouver.</p>
      </div>

      <div className="right-section">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Se connecter</h2>

          {successMessage && (
            <p className="text-green-600 text-center font-semibold mb-4">
              {successMessage}
            </p>
          )}

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@gmail.com"
            required
          />

          <label>Mot de passe</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
            </button>
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
          </div>

          <button type="submit" className="login-button">
            Connexion
          </button>
          <Link to="/mot-de-passe-oublie" className='text-center'><p>Mot de passe oublié</p></Link>
          

          <div className="signup-text">
            <p>Vous n'avez pas de compte ?</p>
            <Link to="/register"><button type="button">Inscrivez-vous</button></Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
