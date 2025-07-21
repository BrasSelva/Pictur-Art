import React, { useState } from 'react';
import '../../assets/css/LoginPage.css'; 
import api from '../../api/api'; // adapte le chemin si besoin

function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await api.post('/utilisateurs/mot-de-passe-oublie', { email });
      setMessage(response.data.message || 'Si cet email existe, un lien vous a été envoyé.');
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation :', error);
      setMessage('Une erreur est survenue, veuillez réessayer plus tard.');
    }
  };

  return (
    <div className="reset-container">
      <h2>Mot de passe oublié</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input 
          type="email" 
          placeholder="exemple@gmail.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <button type="submit">Envoyer le lien de réinitialisation</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default MotDePasseOublie;
