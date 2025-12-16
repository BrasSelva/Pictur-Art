const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const { ajouterMembre, supprimerMembre } = require('../controllers/membreAlbumController');

// Ajouter un membre à un album
router.post('/', verifyToken, ajouterMembre);

// Supprimer un membre (quitter un album)
router.delete('/', verifyToken, supprimerMembre);

module.exports = router;
