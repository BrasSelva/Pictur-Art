const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const { ajouterMembre } = require('../controllers/membreAlbumController');

// Ajouter un membre à un album
router.post('/', verifyToken, ajouterMembre);

module.exports = router;
