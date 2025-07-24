import React from 'react';
import '../../assets/css/reglementation/CguPage.css';

const CGUPage = () => {
  return (
    <div className="cgu-container">
      <div className="cgu-header">
        <h1>Conditions Générales d’Utilisation</h1>
      </div>

      <div className="cgu-content">
        <section>
          <h2>1. Objet</h2>
          <p>
            Les présentes conditions régissent l'utilisation de la plateforme Pictur'Art, permettant le partage d'albums photo et vidéo entre utilisateurs.
          </p>
        </section>

        <section>
          <h2>2. Compte utilisateur</h2>
          <p>
            Toute personne souhaitant créer un compte doit fournir une adresse e-mail valide, un pseudo unique, et un mot de passe. L’utilisateur est responsable de la confidentialité de ses identifiants.
          </p>
        </section>

        <section>
          <h2>3. Propriété des contenus</h2>
          <p>
            Les photos, vidéos, commentaires et autres contenus publiés par les utilisateurs leur appartiennent. Pictur’Art ne revendique aucun droit sur ces médias.
          </p>
        </section>

        <section>
          <h2>4. Comportement interdit</h2>
          <p>
            Il est interdit de partager du contenu illicite, haineux, violent ou portant atteinte aux droits d’autrui. Tout abus entraînera la suppression du compte sans préavis.
          </p>
        </section>

        <section>
          <h2>5. Sécurité et confidentialité</h2>
          <p>
            Les données personnelles sont traitées conformément au RGPD. Aucune information n’est transmise à des tiers sans consentement.
          </p>
        </section>

        <section>
          <h2>6. Résiliation</h2>
          <p>
            L'utilisateur peut supprimer son compte à tout moment. Pictur’Art se réserve également le droit de désactiver tout compte ne respectant pas ces CGU.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CGUPage;
