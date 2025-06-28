const express = require('express');
const router = express.Router();
const { creerUtilisateur } = require('../controllers/utilisateurController');

router.post('/', creerUtilisateur);

module.exports = router;
