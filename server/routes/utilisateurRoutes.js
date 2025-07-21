const express = require('express');
const router = express.Router();
const { creerUtilisateur, connecterUtilisateur, motDePasseOublie } = require('../controllers/utilisateurController');

router.post('/', creerUtilisateur);
router.post('/login', connecterUtilisateur);
router.post('/mot-de-passe-oublie', motDePasseOublie);


module.exports = router;
