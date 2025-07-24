const Media = require('../models/Media');
const MembreAlbum = require('../models/MembreAlbum');
const fs = require('fs');
const path = require('path');

// GET /medias/album/:id
exports.getMediasByAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;
    const userId = req.utilisateur.id;

    // Vérifie que l'utilisateur est membre de l'album
    const estMembre = await MembreAlbum.findOne({ id_album: albumId, id_utilisateur: userId });
    if (!estMembre) {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas membre de cet album" });
    }

    const medias = await Media.find({ id_album: albumId })
      .populate('id_utilisateur', 'nom email')
      .populate('id_album', 'nom date_creation');

    res.json(medias);
  } catch (err) {
    console.error("Erreur dans GET /medias/album/:id :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /medias/upload
exports.uploadMedia = async (req, res) => {
  try {
    const { id_album } = req.body;
    const id_utilisateur = req.utilisateur.id;

    if (!id_album) {
      return res.status(400).json({ message: 'id_album est obligatoire' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu.' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const extension = req.file.mimetype.split('/')[0];

    const nouveauMedia = new Media({
      url: fileUrl,
      type_media: extension === 'image' ? 'photo' : 'video',
      date_publication: new Date(),
      id_album,
      id_utilisateur,
    });

    const saved = await nouveauMedia.save();

    const savedPopulated = await Media.findById(saved._id)
      .populate('id_utilisateur', 'nom email')
      .populate('id_album', 'nom date_creation');

    res.status(201).json(savedPopulated);
  } catch (err) {
    console.error('Erreur upload media :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /medias/:id
exports.deleteMedia = async (req, res) => {
  try {
    const mediaId = req.params.id;
    const userId = req.utilisateur.id;

    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ message: 'Media non trouvé' });
    }

    if (media.id_utilisateur.toString() !== userId) {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas propriétaire de ce média" });
    }

    const filename = path.basename(media.url);
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    fs.unlink(filePath, (err) => {
      if (err) console.warn('Fichier non trouvé ou erreur suppression:', err.message);
    });

    await media.deleteOne();

    res.json({ message: 'Media supprimé avec succès' });
  } catch (err) {
    console.error('Erreur suppression media :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /medias/timeline
exports.getTimelineMedias = async (req, res) => {
  try {
    const membres = await MembreAlbum.find({ id_utilisateur: req.utilisateur.id }).select('id_album');
    const albumIds = membres.map(m => m.id_album);

    const medias = await Media.find({ id_album: { $in: albumIds } })
      .sort({ date_creation: -1 })
      .populate('id_utilisateur')
      .populate('id_album')
      .limit(50);

    res.json(medias);
  } catch (err) {
    console.error("Erreur dans /timeline :", err); 
    res.status(500).json({ message: 'Erreur timeline', error: err.message });
  }
};
