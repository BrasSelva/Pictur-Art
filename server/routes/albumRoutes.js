const express = require('express');
const router = express.Router();
const { creerUtilisateur } = require('../controllers/albumController');

router.get('/albumPage', creerUtilisateur);


module.exports = router;
