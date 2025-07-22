const Commentaire = require('../models/Commentaire');
const Utilisateur = require('../models/Utilisateur');
const Media = require('../models/Media');

describe('Commentaire model', () => {
  it('crée un commentaire lié à un utilisateur et un media', async () => {
    const user = await Utilisateur.create({ nom: 'Toto', email: 'toto@example.com', mot_de_passe: 'Monmot@depasse123' });
    const media = await Media.create({ url: 'media.jpg', type_media: 'image', date_publication: new Date(), id_utilisateur: user._id });

    const commentaire = await Commentaire.create({
      contenu: 'Super !',
      date: new Date(),
      id_utilisateur: user._id,
      id_media: media._id
    });

    expect(commentaire.contenu).toBe('Super !');
  });
});
