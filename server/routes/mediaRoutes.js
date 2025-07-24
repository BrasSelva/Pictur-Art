const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const verifyToken = require('../middlewares/auth');
const {
  getMediasByAlbum,
  uploadMedia,
  deleteMedia,
  getTimelineMedias
} = require('../controllers/mediaController');

// Récupérer les médias d’un album
router.get('/album/:id', verifyToken, getMediasByAlbum);

// Upload d’un média
router.post('/upload', verifyToken, upload.single('media'), uploadMedia);

// Supprimer un média
router.delete('/:id', verifyToken, deleteMedia);

// Fil d’actualité (timeline)
router.get('/timeline', verifyToken, getTimelineMedias);

module.exports = router;
