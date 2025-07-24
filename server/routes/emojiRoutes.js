const express = require('express');
const router = express.Router();
const { getEmojis } = require('../controllers/emojiController');

// Récupérer tous les emojis
router.get('/', getEmojis);

module.exports = router;
