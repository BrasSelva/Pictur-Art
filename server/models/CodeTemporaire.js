const mongoose = require('mongoose');

const codeTemporaireSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expireAt: { type: Date, required: true }
});

// Supprime automatiquement les documents expirés après `expireAt`
codeTemporaireSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('CodeTemporaire', codeTemporaireSchema);
