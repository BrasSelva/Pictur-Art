const express = require('express');
const router = express.Router();
const { creerUtilisateur } = require('../controllers/utilisateurController');

// Route : POST /api/utilisateurs
router.post('/', creerUtilisateur);

module.exports = router;
