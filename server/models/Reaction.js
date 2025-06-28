const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  emoji: String,
  id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  id_media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' }
});

module.exports = mongoose.models.Reaction || mongoose.model('Reaction', reactionSchema);