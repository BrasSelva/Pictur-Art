const Commentaire = require('../models/Commentaire');
const Media = require('../models/Media');
const MembreAlbum = require('../models/MembreAlbum');

// POST /commentaires
exports.ajouterCommentaire = async (req, res) => {
  const { contenu, id_media } = req.body;
  const id_utilisateur = req.utilisateur.id;

  try {
    const media = await Media.findById(id_media);
    if (!media) return res.status(404).json({ message: "Média introuvable" });

    const estMembre = await MembreAlbum.findOne({
      id_utilisateur,
      id_album: media.id_album,
    });

    if (!estMembre) return res.status(403).json({ message: "Accès interdit à ce média" });

    const commentaire = await Commentaire.create({
      contenu,
      id_utilisateur,
      id_media,
      date: new Date(),
    });

    res.status(201).json(commentaire);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE /commentaires/:id
exports.supprimerCommentaire = async (req, res) => {
  const id_utilisateur = req.utilisateur.id;
  const { id } = req.params;

  try {
    const commentaire = await Commentaire.findById(id);
    if (!commentaire) return res.status(404).json({ message: "Commentaire introuvable" });

    if (commentaire.id_utilisateur.toString() !== id_utilisateur) {
      return res.status(403).json({ message: "Tu ne peux supprimer que tes commentaires" });
    }

    await Commentaire.deleteOne({ _id: id });
    res.json({ message: "Commentaire supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /commentaires/media/:id_media
exports.getCommentairesMedia = async (req, res) => {
  const { id_media } = req.params;

  try {
    const commentaires = await Commentaire.find({ id_media })
      .populate('id_utilisateur', 'nom email')
      .sort({ date: -1 });

    res.json(commentaires);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
