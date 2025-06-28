const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Utilisateur = require('./models/Utilisateur');
const Album = require('./models/Album');
const Media = require('./models/Media');
const Commentaire = require('./models/Commentaire');
const Reaction = require('./models/Reaction');
const MembreAlbum = require('./models/MembreAlbum');

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB');

    // Nettoyer les collections
    await Utilisateur.deleteMany();
    await Album.deleteMany();
    await Media.deleteMany();
    await Commentaire.deleteMany();
    await Reaction.deleteMany();
    await MembreAlbum.deleteMany();

    // Créer des utilisateurs
    const sarah = await Utilisateur.create({ nom: 'Sarah', email: 'sarah@example.com', mot_de_passe: 'azerty123' });
    const alex = await Utilisateur.create({ nom: 'Alex', email: 'alex@example.com', mot_de_passe: '123456' });
    const nina = await Utilisateur.create({ nom: 'Nina', email: 'nina@example.com', mot_de_passe: 'mdp123' });

    // Créer un album
    const album1 = await Album.create({ nom: 'Vacances 2024', date_creation: new Date(), id_utilisateur: sarah._id });

    // Membres d’album
    await MembreAlbum.create({ id_utilisateur: sarah._id, id_album: album1._id });
    await MembreAlbum.create({ id_utilisateur: alex._id, id_album: album1._id });

    // Médias
    const media1 = await Media.create({
      url: 'https://picsum.photos/id/1011/400/300',
      type_media: 'photo',
      date_publication: new Date(),
      id_album: album1._id,
      id_utilisateur: sarah._id
    });

    const media2 = await Media.create({
      url: 'https://picsum.photos/id/1012/400/300',
      type_media: 'photo',
      date_publication: new Date(),
      id_album: album1._id,
      id_utilisateur: alex._id
    });

    // Commentaires
    await Commentaire.create({
      contenu: 'Trop bien cette photo !',
      date: new Date(),
      id_utilisateur: nina._id,
      id_media: media1._id
    });

    // Réactions
    await Reaction.create({
      emoji: '❤️',
      id_utilisateur: alex._id,
      id_media: media1._id
    });

    console.log('Données insérées avec succès');
    process.exit();
  } catch (err) {
    console.error('Erreur pendant l’insertion :', err);
    process.exit(1);
  }
}

seed();