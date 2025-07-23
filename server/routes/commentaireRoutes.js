const express = require('express');
const router = express.Router();
const Commentaire = require('../models/Commentaire');
const Media = require('../models/Media');
const MembreAlbum = require('../models/MembreAlbum');
const auth = require('../middlewares/auth');
const Utilisateur = require('../models/Utilisateur');

// POST /api/commentaires — ajouter un commentaire
router.post('/', auth, async (req, res) => {
  const { contenu, id_media } = req.body;
  const id_utilisateur = req.utilisateur.id;

  try {
    const media = await Media.findById(id_media);
    if (!media) return res.status(404).json({ message: "Média introuvable" });

    // Vérifie que l'utilisateur est membre de l’album du média
    const estMembre = await MembreAlbum.findOne({
      id_utilisateur,
      id_album: media.id_album
    });

    if (!estMembre) return res.status(403).json({ message: "Accès interdit à ce média" });

    const commentaire = await Commentaire.create({
      contenu,
      id_utilisateur,
      id_media,
      date: new Date()
    });

    res.status(201).json(commentaire);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/commentaires/:id — supprimer son propre commentaire
router.delete('/:id', auth, async (req, res) => {
    const id_utilisateur = req.utilisateur.id;
    const { id } = req.params;
  
    try {
      const commentaire = await Commentaire.findById(id);
      if (!commentaire) return res.status(404).json({ message: "Commentaire introuvable" });
  
      if (commentaire.id_utilisateur.toString() !== id_utilisateur) {
        return res.status(403).json({ message: "Tu ne peux supprimer que tes commentaires" });
      }
  
      await Commentaire.deleteOne({ _id: id });
      res.json({ message: "Commentaire supprimé" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

// GET /api/commentaires/media/:id_media — lister les commentaires d’un média
router.get('/media/:id_media', async (req, res) => {
    const { id_media } = req.params;
  
    try {
      const commentaires = await Commentaire.find({ id_media })
        .populate('id_utilisateur', 'nom email')
        .sort({ date: -1 }); // les plus récents en premier
  
      res.json(commentaires);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

module.exports = router;
