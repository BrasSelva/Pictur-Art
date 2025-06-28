const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
  contenu: String,
  date: Date,
  id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  id_media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' }
});

module.exports = mongoose.models.Commentaire || mongoose.model('Commentaire', commentaireSchema);