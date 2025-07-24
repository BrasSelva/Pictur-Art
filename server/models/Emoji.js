const mongoose = require('mongoose');

const emojiSchema = new mongoose.Schema({
  emoji: String,
  libelle: {
    type: String,
    required: true
  }
});

module.exports = mongoose.models.Emoji || mongoose.model('Emoji', emojiSchema);
