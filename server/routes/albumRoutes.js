const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const verifyToken = require('../middlewares/auth');
const MembreAlbum = require('../models/MembreAlbum');
const upload = require('../middlewares/multer');

// GET /albums
router.get('/', verifyToken, async (req, res) => {
  try {
    // On cherche tous les albums où l'utilisateur est membre
    const membres = await MembreAlbum.find({ id_utilisateur: req.utilisateur.id });
    const albumIds = membres.map((m) => m.id_album);

    const albums = await Album.find({ _id: { $in: albumIds } })
      .sort({ date_creation: -1 })
      .populate('id_utilisateur', 'nom');

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


// POST /albums — avec image facultative
router.post('/', verifyToken, upload.single('couverture'), async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) {
      return res.status(400).json({ message: 'Nom requis' });
    }

    // Création de l’album
    const nouvelAlbum = new Album({
      nom,
      date_creation: new Date(),
      id_utilisateur: req.utilisateur.id,
      image: req.file ? req.file.filename : null,
    });

    await nouvelAlbum.save();

    // Création du membreAlbum (membre = créateur)
    const membre = new MembreAlbum({
      id_utilisateur: req.utilisateur.id,
      id_album: nouvelAlbum._id,
    });
    await membre.save();

    res.status(201).json({ album: nouvelAlbum, membre });
  } catch (error) {
    console.error('Erreur création album:', error);
    res.status(500).json({ message: 'Erreur serveur' });
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
  
// Modifier la photo de couverture
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



module.exports = router;
