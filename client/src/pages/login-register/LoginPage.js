import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/LoginPage.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Connexion :', { email, password });
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
          </div>

          <button type="submit" className="login-button">
            Connexion
          </button>

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
