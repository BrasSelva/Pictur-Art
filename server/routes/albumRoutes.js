const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const verifyToken = require('../middlewares/auth');
const upload = require('../middlewares/multer');

// GET /albums : Récupère les albums de l'utilisateur connecté
router.get('/', verifyToken, async (req, res) => {
  try {
    const albums = await Album.find({ id_utilisateur: req.utilisateur.id })
      .sort({ date_creation: -1 })
      .populate('id_utilisateur', 'nom');

    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /albums : Crée un album avec couverture facultative
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

// PATCH /albums/:id/couverture : Modifier la couverture d’un album
router.patch('/:id/couverture', verifyToken, upload.single('couverture'), async (req, res) => {
  try {
    const album = await Album.findOne({ _id: req.params.id, id_utilisateur: req.utilisateur.id });

    if (!album) {
      return res.status(404).json({ message: 'Album introuvable ou non autorisé.' });
    }

    if (req.file) {
      album.image = req.file.filename;
      await album.save();
    }

    res.json({ message: 'Couverture mise à jour avec succès.', album });
  } catch (error) {
    console.error('Erreur modification couverture :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


// POST /api/albums/:id/invite
router.post("/:id/invite", verifyToken, async (req, res) => {
  const { pseudo } = req.body;
  const albumId = req.params.id;

  try {
    const userToInvite = await Utilisateur.findOne({ pseudo });
    if (!userToInvite) return res.status(404).json({ message: "Utilisateur introuvable" });

    const album = await Album.findById(albumId);
    if (!album) return res.status(404).json({ message: "Album introuvable" });

    if (!album.membres.includes(userToInvite._id)) {
      album.membres.push(userToInvite._id);
      await album.save();
    }

    res.json({ message: "Invitation envoyée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
