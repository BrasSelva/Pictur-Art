import React from 'react';
import './../assets/css/HomePage.css'; 
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-container">
      <header className="header">
        <div className="logo-section">
          <img src="img/logoPicturArt.png" alt="logo" />
        </div>
        
        <nav className="nav">
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
        </nav>
      </header>

      <main className="main-content">
        <section className="text-section">
          <h2>Bienvenue sur<br />Pictur'Art</h2>
          <h3>
            Partagez vos plus beaux souvenirs,<br />
            en toute simplicité et en toute sécurité.
          </h3>
          <p>
            Pictur'Art est une plateforme collaborative qui vous permet de créer et partager des albums photo et
            vidéo au sein de groupes privés. En famille, entre amis ou dans votre communauté, rassemblez vos
            moments préférés dans des espaces sécurisés, où seuls les membres invités peuvent publier,
            commenter ou réagir.
          </p>
          <Link to="/login" className="start-button">Commencer</Link>
        </section>

        <section className="image-section">
          <img src="img/accueil_picturart_sans_bg.png" alt="Image de l'application Pictur'Art" />
        </section>
      </main>
    </div>
  );
}

export default HomePage;