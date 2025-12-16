const Emoji = require('../models/Emoji');

// GET /emojis
exports.getEmojis = async (req, res) => {
  try {
    const emojis = await Emoji.find();
    res.json(emojis);
  } catch (err) {
    console.error("Erreur récupération emojis :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
