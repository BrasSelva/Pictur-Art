const Album = require('../models/Album');
const MembreAlbum = require('../models/MembreAlbum');

// GET /albums
exports.getAlbums = async (req, res) => {
  try {
    const membres = await MembreAlbum.find({ id_utilisateur: req.utilisateur.id });
    const albumIds = membres.map((m) => m.id_album);

    const albums = await Album.find({ _id: { $in: albumIds } })
      .sort({ date_creation: -1 })
      .populate('id_utilisateur', 'nom');

    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /albums/:id
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album non trouvé' });

    const estMembre = await MembreAlbum.findOne({
      id_album: album._id,
      id_utilisateur: req.utilisateur.id,
    });

    if (!estMembre) return res.status(403).json({ message: 'Accès refusé à cet album' });

    res.json(album);
  } catch (error) {
    console.error('Erreur récupération album:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /albums
exports.createAlbum = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: 'Nom requis' });

    const nouvelAlbum = new Album({
      nom,
      date_creation: new Date(),
      id_utilisateur: req.utilisateur.id,
      image: req.file ? req.file.filename : null,
    });

    await nouvelAlbum.save();

    const membre = new MembreAlbum({
      id_utilisateur: req.utilisateur.id,
      id_album: nouvelAlbum._id,
    });
    await membre.save();

    res.status(201).json({ album: nouvelAlbum, membre });
  } catch (error) {
    console.error('Erreur création album:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /albums/:id
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findOneAndDelete({
      _id: req.params.id,
      id_utilisateur: req.utilisateur.id,
    });

    if (!album) {
      return res.status(404).json({ message: "Album introuvable ou non autorisé." });
    }

    res.json({ message: "Album supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression album:", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'album." });
  }
};

// albums/:id/couverture
exports.updateCouverture = async (req, res) => {
  try {
    const album = await Album.findOne({
      _id: req.params.id,
      id_utilisateur: req.utilisateur.id,
    });

    if (!album) return res.status(404).json({ message: 'Album introuvable ou non autorisé.' });

    if (req.file) {
      album.image = req.file.filename;
      await album.save();
    }

    res.json({ message: 'Couverture mise à jour avec succès.', album });
  } catch (error) {
    console.error('Erreur modification couverture :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
