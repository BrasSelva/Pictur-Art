const express = require('express');
const router = express.Router();
const { creerUtilisateur, connecterUtilisateur, motDePasseOublie, verifierCode, changerMotDePasse } = require('../controllers/utilisateurController');

router.post('/', creerUtilisateur);
router.post('/login', connecterUtilisateur);
router.post('/mot-de-passe-oublie', motDePasseOublie);
router.post('/verifier-code', verifierCode);
router.post('/changerMotDePasse', changerMotDePasse);



module.exports = router;
