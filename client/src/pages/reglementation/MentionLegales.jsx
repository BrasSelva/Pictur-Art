import React from 'react';
import '../../assets/css/reglementation/MentionLegales.css';

const MentionsLegalesPage = () => {
  return (
    <div className="mentions-container">
      <div className="mentions-header">
        <h1>Mentions légales</h1>
      </div>

      <div className="mentions-content">
        <section>
          <h2>1. Éditeur du site</h2>
          <p>
            Le site Pictur’Art est un projet pédagogique développé dans le cadre d’un Master 1 Développement Web.
          </p>
          <p><strong>Responsable de publication :</strong> L’équipe Pictur’Art</p>
        </section>

        <section>
          <h2>2. Hébergement</h2>
          <p>
            Le site est hébergé par :
            <br />
            <strong>Render.com</strong> pour l’API
            <br />
            <strong>Netlify</strong> pour le frontend
          </p>
        </section>

        <section>
          <h2>3. Propriété intellectuelle</h2>
          <p>
            Tous les éléments du site Pictur’Art (textes, images, logos, code, etc.) sont la propriété exclusive de leurs auteurs. Toute reproduction est interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section>
          <h2>4. Données personnelles</h2>
          <p>
            Conformément au RGPD, les données collectées sont traitées dans le respect de la vie privée. Voir notre page <a href="/cguPage">CGU</a> pour plus d’informations.
          </p>
        </section>

        <section>
          <h2>5. Contact</h2>
          <p>
            Pour toute question ou réclamation, vous pouvez nous contacter à picturart@contact.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default MentionsLegalesPage;
