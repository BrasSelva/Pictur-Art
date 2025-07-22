const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const verifyToken = require('../middlewares/auth');
const upload = require('../middlewares/multer');

// GET /albums
router.get('/', verifyToken, async (req, res) => {
  try {
    const albums = await Album.find({ id_utilisateur: req.utilisateur.id }).sort({ date_creation: -1 });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /albums — avec image facultative
router.post('/', verifyToken, upload.single('couverture'), async (req, res) => {
  try {
    const imagePath = req.file ? req.file.filename : null;

    const album = new Album({
      nom: req.body.nom,
      date_creation: req.body.date_creation || new Date(),
      id_utilisateur: req.utilisateur.id,
      image: imagePath,
    });

    await album.save();
    res.status(201).json(album);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de l'album." });
  }
});

// Delete/albums
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const album = await Album.findOneAndDelete({
      _id: req.params.id,
      id_utilisateur: req.utilisateur.id
    });

    if (!album) {
      return res.status(404).json({ message: "Album introuvable ou non autorisé." });
    }

    res.json({ message: "Album supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression album:", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'album." });
  }
});


module.exports = router;
