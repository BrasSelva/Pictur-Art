const MembreAlbum = require('../models/MembreAlbum');

// POST /membrealbums
exports.ajouterMembre = async (req, res) => {
  try {
    const { id_utilisateur, id_album } = req.body;

    const dejaMembre = await MembreAlbum.findOne({ id_utilisateur, id_album });
    if (dejaMembre) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà membre de cet album.' });
    }

    const nouveauMembre = new MembreAlbum({ id_utilisateur, id_album });
    await nouveauMembre.save();

    res.status(201).json(nouveauMembre);
  } catch (err) {
    console.error('Erreur ajout membre album:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
