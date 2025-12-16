const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {ajouterReaction, getReactionsMedia, getReactionCounts, toggleReaction} = require('../controllers/reactionController');

router.post('/', auth, ajouterReaction);
router.get('/media/:id_media', getReactionsMedia);
router.get('/media/:id_media/count', getReactionCounts);
router.post('/toggle', auth, toggleReaction);

module.exports = router;
