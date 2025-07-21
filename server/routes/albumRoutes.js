const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const verifyToken = require('../middlewares/auth');

router.get('/', verifyToken, async (req, res) => {
  try {
    const albums = await Album.find({ id_utilisateur: req.utilisateur.id }).sort({ date_creation: -1 });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
