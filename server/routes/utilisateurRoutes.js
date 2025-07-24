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

// GET /api/utilisateurs/by-pseudo/:pseudo
router.get('/by-pseudo/:pseudo', verifyToken, async (req, res) => {
  try {
    const user = await Utilisateur.findOne({ nom: req.params.pseudo });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



module.exports = router;
