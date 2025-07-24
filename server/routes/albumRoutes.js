const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const verifyToken = require('../middlewares/auth');
const {getAlbums, getAlbumById, createAlbum, deleteAlbum, updateCouverture,
} = require('../controllers/albumController');

// Récupère tous les albums de l’utilisateur connecté
router.get('/', verifyToken, getAlbums);

// Récupère un album précis par son ID
router.get('/:id', verifyToken, getAlbumById);

// Crée un nouvel album (optionnellement avec une image de couverture)
router.post('/', verifyToken, upload.single('couverture'), createAlbum);

// Supprime un album par ID
router.delete('/:id', verifyToken, deleteAlbum);

// Met à jour uniquement la couverture d’un album
router.patch('/:id/couverture', verifyToken, upload.single('couverture'), updateCouverture);

module.exports = router;
