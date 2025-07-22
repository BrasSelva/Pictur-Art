const Album = require('../models/Album');
const Utilisateur = require('../models/Utilisateur');

describe('Album model', () => {
  it('crée un album avec un utilisateur lié', async () => {
    const user = await Utilisateur.create({ nom: 'Bob', email: 'bob@example.com', mot_de_passe: '123456@Azerty' });
    const album = await Album.create({ nom: 'Vacances', date_creation: new Date(), id_utilisateur: user._id });

    const found = await Album.findOne({ nom: 'Vacances' }).populate('id_utilisateur');
    expect(found.id_utilisateur.email).toBe('bob@example.com');
  });
});
