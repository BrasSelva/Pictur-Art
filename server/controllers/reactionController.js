const mongoose = require('mongoose');
const Reaction = require('../models/Reaction');
const Emoji = require('../models/Emoji');
const Media = require('../models/Media');

// POST /api/reactions
exports.ajouterReaction = async (req, res) => {
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
};

// GET /api/reactions/media/:id_media
exports.getReactionsMedia = async (req, res) => {
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
};

// GET /api/reactions/media/:id_media/count
exports.getReactionCounts = async (req, res) => {
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
};

// POST /api/reactions/toggle
exports.toggleReaction = async (req, res) => {
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
        await Reaction.deleteOne({ _id: existingReaction._id });
        return res.json({ message: "Réaction supprimée" });
      } else {
        await Reaction.deleteOne({ _id: existingReaction._id });
      }
    }

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
};
