const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const auth = require('../middlewares/auth'); 
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middlewares/auth');

require('../models/Album');

router.get('/album/:id', auth, async (req, res) => {
  try {
    const albumId = req.params.id;
    const userId = req.utilisateur.id;

    // Vérifier que l'utilisateur est membre de l'album
    const estMembre = await MembreAlbum.findOne({ id_album: albumId, id_utilisateur: userId });
    if (!estMembre) {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas membre de cet album" });
    }

    // Récupérer les médias
    const medias = await Media.find({ id_album: albumId })
      .populate('id_utilisateur', 'nom email')
      .populate('id_album', 'nom date_creation');

    res.json(medias);
  } catch (err) {
    console.error("Erreur dans GET /medias/album/:id :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

router.get('/timeline', verifyToken, async (req, res) => {
  try {
    const albums = await MembreAlbum.find({ id_utilisateur: req.utilisateur.id }).select('id_album');
    const albumIds = albums.map(m => m.id_album);

    const medias = await Media.find({ id_album: { $in: albumIds } })
      .sort({ date_creation: -1 })
      .populate('id_utilisateur')
      .populate('id_album')
      .limit(50); // optionnel : limite

    res.json(medias);
  } catch (err) {
    res.status(500).json({ message: 'Erreur timeline' });
  }
});
const auth = require('../middlewares/auth');
const {getMediasByAlbum, uploadMedia, deleteMedia} = require('../controllers/mediaController');

// Routes
router.get('/album/:id', auth, getMediasByAlbum);
router.post('/upload', auth, upload.single('media'), uploadMedia);
router.delete('/:id', auth, deleteMedia);

module.exports = router;
