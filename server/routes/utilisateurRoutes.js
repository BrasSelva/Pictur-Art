const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');
const verifyToken = require('../middlewares/auth');
const { creerUtilisateur, connecterUtilisateur, motDePasseOublie, verifierCode, changerMotDePasse, modifierProfil } = require('../controllers/utilisateurController');

router.post('/', creerUtilisateur);
router.post('/login', connecterUtilisateur);
router.post('/mot-de-passe-oublie', motDePasseOublie);
router.post('/verifier-code', verifierCode);
router.post('/changerMotDePasse', changerMotDePasse);

router.put('/modifier', modifierProfil);



module.exports = router;
