const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const upload = require('../middlewares/multer');
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

router.post('/upload', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier reçu.' });

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const extension = req.file.mimetype.split('/')[0]; // "image", "video"...

    const { id_album, id_utilisateur } = req.body;

    const nouveauMedia = new Media({
      url: fileUrl,
      type_media: extension === 'image' ? 'photo' : 'video',
      date_publication: new Date(),
      id_album,
      id_utilisateur
    });

    const saved = await nouveauMedia.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Erreur upload media :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;