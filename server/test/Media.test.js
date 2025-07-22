const Media = require('../models/Media');
const Album = require('../models/Album');
const Utilisateur = require('../models/Utilisateur');

describe('Media model', () => {
  it('crée un media lié à un album et un utilisateur', async () => {
    const user = await Utilisateur.create({ nom: 'Nina', email: 'nina@example.com', mot_de_passe: 'Monmot@depasse123' });
    const album = await Album.create({ nom: 'Anniversaire', date_creation: new Date(), id_utilisateur: user._id });

    const media = await Media.create({
      url: 'photo.png',
      type_media: 'image',
      date_publication: new Date(),
      id_album: album._id,
      id_utilisateur: user._id
    });

    expect(media.url).toBe('photo.png');
  });
});
