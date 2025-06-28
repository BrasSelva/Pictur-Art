const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  nom: String,
  email: String,
  mot_de_passe: String
});

module.exports = mongoose.models.Utilisateur || mongoose.model('Utilisateur', utilisateurSchema);