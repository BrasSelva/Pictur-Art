const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');
const verifyToken = require('../middlewares/auth');
const {getUtilisateurByPseudo, creerUtilisateur, connecterUtilisateur, motDePasseOublie, verifierCode, changerMotDePasse, modifierProfil, contact } = require('../controllers/utilisateurController');

router.post('/', creerUtilisateur);
router.post('/login', connecterUtilisateur);
router.post('/mot-de-passe-oublie', motDePasseOublie);
router.post('/verifier-code', verifierCode);
router.post('/changerMotDePasse', changerMotDePasse);
router.post('/contact', contact);

router.put('/modifier', modifierProfil);

router.get('/by-pseudo/:pseudo', verifyToken, getUtilisateurByPseudo);


module.exports = router;
