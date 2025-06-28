const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true }
});

// Hachage du mot de passe
utilisateurSchema.pre('save', async function (next) {
  if (!this.isModified('mot_de_passe')) return next(); // si déjà hashé
  try {
    const salt = await bcrypt.genSalt(10);
    this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
