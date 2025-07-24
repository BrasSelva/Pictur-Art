const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const verifyToken = require('../middlewares/auth');
const {getAlbums, getAlbumById, createAlbum, deleteAlbum, updateCouverture,
} = require('../controllers/albumController');

// Routes protégées
router.get('/', verifyToken, getAlbums);
router.get('/:id', verifyToken, getAlbumById);
router.post('/', verifyToken, upload.single('couverture'), createAlbum);
router.delete('/:id', verifyToken, deleteAlbum);
router.patch('/:id/couverture', verifyToken, upload.single('couverture'), updateCouverture);

module.exports = router;
