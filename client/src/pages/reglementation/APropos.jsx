import React from 'react';
import '../../assets/css/reglementation/Apropos.css';
import { Link } from 'react-router-dom';

const AProposPage = () => {
  return (
    <div className="apropos-container">
      <div className="apropos-header">
        <Link to="/login" className="back-link">← Retour à l'accueil</Link>
        <h1>À propos de Pictur’Art</h1>
        <p>Une plateforme pensée pour le partage visuel en toute simplicité.</p>
      </div>

      <div className="apropos-content">
        <section>
          <h2>📸 Notre mission</h2>
          <p>
            Offrir un espace sécurisé et convivial pour partager vos souvenirs en photos et vidéos avec vos proches, dans des albums privés ou de groupe.
          </p>
        </section>

        <section>
          <h2>🧠 Ce qu’on propose</h2>
          <ul>
            <li>Création et gestion d’albums privés</li>
            <li>Ajout de membres pour collaborer</li>
            <li>Réactions emoji et commentaires</li>
            <li>Gestion des médias (upload, suppression, tri)</li>
            <li>Protection des données personnelles</li>
          </ul>
        </section>

        <section>
          <h2>👩‍💻 Développé avec passion</h2>
          <p>
            Pictur’Art a été développé dans le cadre d’un projet de Master 1. L’objectif : combiner des compétences en développement web full stack, sécurité, design responsive et expérience utilisateur.
          </p>
        </section>

        <section>
          <h2>📬 Contact</h2>
          <p>
            Une suggestion, une question ou un bug à signaler ? Contactez-nous à picturart@contact.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default AProposPage;
