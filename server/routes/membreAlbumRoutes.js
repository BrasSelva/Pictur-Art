const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const { ajouterMembre } = require('../controllers/membreAlbumController');

// Ajouter un membre à un album
router.post('/', verifyToken, async (req, res) => {
  try {
    const { id_utilisateur, id_album } = req.body;

    // Vérifie s’il est déjà membre
    const dejaMembre = await MembreAlbum.findOne({ id_utilisateur, id_album });
    if (dejaMembre) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà membre de cet album.' });
    }

    const nouveauMembre = new MembreAlbum({ id_utilisateur, id_album });
    await nouveauMembre.save();

    res.status(201).json(nouveauMembre);
  } catch (err) {
    console.error('Erreur ajout membre album:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/', verifyToken, async (req, res) => {
  const { id_utilisateur, id_album } = req.body;

  if (!id_utilisateur || !id_album) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    const result = await MembreAlbum.deleteOne({ id_utilisateur, id_album });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Aucune correspondance trouvée' });
    }
    res.status(200).json({ message: "Vous avez quitté l'album." });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

router.post('/', verifyToken, ajouterMembre);

module.exports = router;
