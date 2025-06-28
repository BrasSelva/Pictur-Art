const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  nom: String,
  date_creation: Date,
  id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }
});

module.exports = mongoose.models.Album || mongoose.model('Album', albumSchema);