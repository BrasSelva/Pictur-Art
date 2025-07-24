const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Reaction = require('../models/Reaction');
const Emoji = require('../models/Emoji');
const Media = require('../models/Media');
const auth = require('../middlewares/auth');

// POST /api/reactions — Ajouter une réaction directe (non utilisé si toggle existe)
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

// GET /api/reactions/media/:id_media — Voir les réactions d’un média
router.get('/media/:id_media', async (req, res) => {
  const { id_media } = req.params;

  try {
    const reactions = await Reaction.find({ id_media })
      .populate('id_utilisateur', 'nom email')
      .populate('id_emoji', 'emoji libelle')
      .sort({ date_publication: -1 });

    res.json(reactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/reactions/media/:id_media/count — Obtenir le nombre de réactions par emoji
router.get('/media/:id_media/count', async (req, res) => {
  const { id_media } = req.params;

  try {
    const counts = await Reaction.aggregate([
      { $match: { id_media: new mongoose.Types.ObjectId(id_media) } },
      { $group: { _id: "$id_emoji", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "emojis",
          localField: "_id",
          foreignField: "_id",
          as: "emoji_info"
        }
      },
      { $unwind: "$emoji_info" },
      {
        $project: {
          emoji: "$emoji_info.emoji",
          libelle: "$emoji_info.libelle",
          count: 1
        }
      }
    ]);

    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/reactions/toggle — Ajouter ou supprimer une réaction, une seule par utilisateur
router.post('/toggle', auth, async (req, res) => {
  const { id_media, id_emoji } = req.body;
  const id_utilisateur = req.utilisateur.id;

  try {
    const media = await Media.findById(id_media);
    if (!media) return res.status(404).json({ message: "Média introuvable" });

    const emoji = await Emoji.findById(id_emoji);
    if (!emoji) return res.status(400).json({ message: "Emoji non autorisé" });

    const existingReaction = await Reaction.findOne({ id_media, id_utilisateur });

    if (existingReaction) {
      if (existingReaction.id_emoji.toString() === id_emoji) {
        // Même emoji => toggle off (supprimer)
        await Reaction.deleteOne({ _id: existingReaction._id });
        return res.json({ message: "Réaction supprimée" });
      } else {
        // Emoji différent => supprimer ancienne réaction
        await Reaction.deleteOne({ _id: existingReaction._id });
      }
    }

    // Créer nouvelle réaction
    const newReaction = await Reaction.create({
      id_media,
      id_utilisateur,
      id_emoji,
      date_publication: new Date()
    });

    return res.status(201).json(newReaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
