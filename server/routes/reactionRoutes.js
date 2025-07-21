const express = require('express');
const router = express.Router();
const Reaction = require('../models/Reaction');
const Emoji = require('../models/Emoji');
const Media = require('../models/Media');
const auth = require('../middleware/auth');

// POST /api/reactions
router.post('/', auth, async (req, res) => {
  const { id_media, id_emoji } = req.body;
  const id_utilisateur = req.utilisateur.id;

  try {
    const media = await Media.findById(id_media);
    if (!media) return res.status(404).json({ message: "Média introuvable" });

    const emoji = await Emoji.findById(id_emoji);
    if (!emoji) return res.status(400).json({ message: "Emoji non autorisé" });

    const alreadyReacted = await Reaction.findOne({ id_media, id_utilisateur, id_emoji });
    if (alreadyReacted) {
      return res.status(409).json({ message: "Réaction déjà enregistrée." });
    }

    const reaction = await Reaction.create({
      id_media,
      id_utilisateur,
      id_emoji,
      date_publication: new Date()
    });

    res.status(201).json(reaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
