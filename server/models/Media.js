const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: String,
  type_media: String,
  date_publication: Date,
  id_album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }
});

module.exports = mongoose.models.Media || mongoose.model('Media', mediaSchema);