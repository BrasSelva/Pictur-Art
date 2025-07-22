const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const verifyToken = require('../middlewares/auth');
const MembreAlbum = require('../models/MembreAlbum');

router.get('/', verifyToken, async (req, res) => {
  try {
    const albums = await Album.find({ id_utilisateur: req.utilisateur.id }).sort({ date_creation: -1 });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ message: 'Album non trouvé' });
    }

    const userId = req.utilisateur.id;

    // Vérifie si l'utilisateur est membre (propriétaire inclus s'il est dans membreAlbum)
    const estMembre = await MembreAlbum.findOne({ id_album: album._id, id_utilisateur: userId });
    if (!estMembre) {
      return res.status(403).json({ message: 'Accès refusé à cet album' });
    }

    res.json(album);
  } catch (error) {
    console.error('Erreur récupération album:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
