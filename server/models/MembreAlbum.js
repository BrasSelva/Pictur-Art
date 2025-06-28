const mongoose = require('mongoose');

const membreAlbumSchema = new mongoose.Schema({
  id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  id_album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' }
});

module.exports = mongoose.models.MembreAlbum || mongoose.model('MembreAlbum', membreAlbumSchema);
