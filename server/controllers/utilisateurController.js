const Utilisateur = require('../models/Utilisateur');

exports.creerUtilisateur = async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;

    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    if (emailDejaExistant) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    //Création de l'utilisateur
    const nouvelUtilisateur = new Utilisateur({ nom, email, mot_de_passe });
    await nouvelUtilisateur.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
