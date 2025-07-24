const express = require('express');
const router = express.Router();
const MembreAlbum = require('../models/MembreAlbum');

router.post('/', async (req, res) => {
  try {
    const { id_utilisateur, id_album } = req.body;
    if (!id_utilisateur || !id_album) {
      return res.status(400).json({ message: 'id_utilisateur et id_album requis' });
    }

    // Vérifie si ce membre est déjà dans l'album pour éviter les doublons
    const existe = await MembreAlbum.findOne({ id_utilisateur, id_album });
    if (existe) {
      return res.status(409).json({ message: 'Déjà membre de cet album' });
    }

    const membre = new MembreAlbum({ id_utilisateur, id_album });
    await membre.save();
    res.status(201).json(membre);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});



module.exports = router;
