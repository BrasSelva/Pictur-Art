const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middlewares/auth');


const MembreAlbum = require('../models/MembreAlbum');
const Media = require('../models/Media');

require('../models/Album');
const { getMediasByAlbum, uploadMedia, deleteMedia } = require('../controllers/mediaController');


// Routes
router.get('/album/:id', verifyToken, getMediasByAlbum);
router.post('/upload', verifyToken, upload.single('media'), uploadMedia);
router.delete('/:id', verifyToken, deleteMedia);


router.get('/timeline', verifyToken, async (req, res) => {

  try {
    const membres = await MembreAlbum.find({ id_utilisateur: req.utilisateur.id }).select('id_album');
    const albumIds = membres.map(m => m.id_album);

    const medias = await Media.find({ id_album: { $in: albumIds } })
      .sort({ date_creation: -1 })
      .populate('id_utilisateur')
      .populate('id_album')
      .limit(50);

    res.json(medias);
  } catch (err) {
    console.error("Erreur dans /timeline :", err); 
    res.status(500).json({ message: 'Erreur timeline', error: err.message });
  }
});

module.exports = router;
