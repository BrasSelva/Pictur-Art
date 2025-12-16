const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  id_emoji: { type: mongoose.Schema.Types.ObjectId, ref: 'Emoji' },
  id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  id_media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
  date_publication: Date,
});

module.exports = mongoose.models.Reaction || mongoose.model('Reaction', reactionSchema);