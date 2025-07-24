const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const auth = require('../middlewares/auth');
const {getMediasByAlbum, uploadMedia, deleteMedia} = require('../controllers/mediaController');

// Routes
router.get('/album/:id', auth, getMediasByAlbum);
router.post('/upload', auth, upload.single('media'), uploadMedia);
router.delete('/:id', auth, deleteMedia);

module.exports = router;
