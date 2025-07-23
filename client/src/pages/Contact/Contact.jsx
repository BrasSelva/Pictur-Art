import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/footers/Footer';
import '../../assets/css/Contact.css';
import api from '../../api/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post('/utilisateurs/contact', formData);
    setSuccessMessage('Votre message a été envoyé avec succès !');
    setTimeout(() => {
      setSuccessMessage('');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    setSuccessMessage("Une erreur est survenue.");
  }
};


  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-header">
          <Link to="/login" className="back-link">← Retour à l'accueil</Link>
          <div className="contact-intro">
            <h1>
              <span>Contactez</span><span>-nous</span>
            </h1>
            <p>Une question ? Un problème ? Notre équipe est là pour vous aider.</p>
          </div>
        </div>

        <div className="contact-main">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>support@picturart.fr</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📱</div>
              <h3>Téléphone</h3>
              <p>+33 1 23 45 67 89</p>
            </div>
            
          </div>

          <div className="contact-form-section">
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Envoyez-nous un message</h2>
              
              {successMessage && (
                <div className="success-message">
                  {successMessage}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nom complet</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.fr"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Sujet</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisissez un sujet</option>
                  <option value="support">Support technique</option>
                  <option value="billing">Facturation</option>
                  <option value="feature">Suggestion de fonctionnalité</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre demande en détail..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-button">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;