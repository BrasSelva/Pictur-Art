const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
require('../models/Album');

router.get('/album/:id', async (req, res) => {
  try {
    const medias = await Media.find({ id_album: req.params.id })
      .populate('id_utilisateur', 'nom email')
      .populate('id_album', 'nom date_creation');

    res.json(medias);
  } catch (err) {
    console.error("Erreur dans GET /medias/album/:id :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;

