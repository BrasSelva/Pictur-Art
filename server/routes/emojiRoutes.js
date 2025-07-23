const express = require('express');
const router = express.Router();
const Emoji = require('../models/Emoji');

// GET /api/emojis — liste des emojis disponibles
router.get('/', async (req, res) => {
  try {
    const emojis = await Emoji.find();
    res.json(emojis);
  } catch (err) {
    console.error("Erreur récupération emojis :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
