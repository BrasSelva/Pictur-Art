const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const {ajouterCommentaire, supprimerCommentaire, getCommentairesMedia} = require('../controllers/commentaireController');

// Ajouter un commentaire
router.post('/', auth, ajouterCommentaire);

// Supprimer un commentaire
router.delete('/:id', auth, supprimerCommentaire);

// Récupérer les commentaires d’un média
router.get('/media/:id_media', getCommentairesMedia);

module.exports = router;
