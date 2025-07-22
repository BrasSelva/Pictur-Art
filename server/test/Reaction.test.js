const Reaction = require('../models/Reaction');
const Utilisateur = require('../models/Utilisateur');
const Media = require('../models/Media');

describe('Reaction model', () => {
  it('crée une réaction emoji liée à un utilisateur et un media', async () => {
    const user = await Utilisateur.create({ nom: 'Emma', email: 'emma@example.com', mot_de_passe: 'Monmot@depasse123' });
    const media = await Media.create({ url: 'img.jpg', type_media: 'image', date_publication: new Date(), id_utilisateur: user._id });

    const reaction = await Reaction.create({ emoji: '❤️', id_utilisateur: user._id, id_media: media._id });

    expect(reaction.emoji).toBe('❤️');
  });
});
