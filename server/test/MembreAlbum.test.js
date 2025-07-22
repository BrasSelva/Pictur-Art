const MembreAlbum = require('../models/MembreAlbum');
const Utilisateur = require('../models/Utilisateur');
const Album = require('../models/Album');

describe('MembreAlbum model', () => {
  it('crée un membre d\'album lié à un utilisateur et un album', async () => {
    const user = await Utilisateur.create({ nom: 'John', email: 'john@example.com', mot_de_passe: 'Monmot@depasse123' });
    const album = await Album.create({ nom: 'Voyage', date_creation: new Date(), id_utilisateur: user._id });

    const membre = await MembreAlbum.create({ id_utilisateur: user._id, id_album: album._id });

    expect(membre.id_utilisateur.toString()).toBe(user._id.toString());
  });
});
