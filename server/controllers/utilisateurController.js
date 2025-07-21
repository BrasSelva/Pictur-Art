const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();  
const Utilisateur = require('../models/Utilisateur');
const nodemailer = require('nodemailer');

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error('JWT_SECRET est manquant dans le fichier .env');
}

exports.creerUtilisateur = async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;

    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const emailDejaExistant = await Utilisateur.findOne({ email });
    if (emailDejaExistant) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    //Création de l'utilisateur
    const nouvelUtilisateur = new Utilisateur({ nom, email, mot_de_passe });
    console.log("nouvelUtilisateur:",nouvelUtilisateur);
    
    await nouvelUtilisateur.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.connecterUtilisateur = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // recherche de l'utilisateur
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Comparaison du mot de passe avec bcrypt
    const passwordOk = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    if (!passwordOk) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

     const token = jwt.sign(
      { id: utilisateur._id, email: utilisateur.email },  // payload
      SECRET_KEY,                                         // clé secrète
      { expiresIn: '2h' }                                 // options
    );

    // Si tout est bon, renvoie les infos (sans le mot de passe !)
    res.status(200).json({
      message: "Connexion réussie",
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email
      },
      token
    });

  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.motDePasseOublie = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email requis." });
  }

  try {
    const utilisateur = await Utilisateur.findOne({ email });

    if (!utilisateur) {
      // Pour la sécurité, on envoie quand même un message neutre
      return res.status(200).json({ message: "Si cet email existe, un nouveau mot de passe a été envoyé." });
    }

    // Générer un mot de passe aléatoire
    const nouveauMotDePasse = genererMotDePasse(10);

    // Hasher le mot de passe
    const motDePasseHash = await bcrypt.hash(nouveauMotDePasse, 10);

    // Sauvegarder
    utilisateur.mot_de_passe = motDePasseHash;
    await utilisateur.save();

    // Envoyer l'email
    await envoyerEmail(utilisateur.email, nouveauMotDePasse, utilisateur.nom);

    res.status(200).json({ message: "Si cet email existe, un nouveau mot de passe a été envoyé." });
  } catch (error) {
    console.error("Erreur lors du reset de mot de passe :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Générateur de mot de passe
function genererMotDePasse(longueur) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let mdp = '';
  for (let i = 0; i < longueur; i++) {
    mdp += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return mdp;
}

// Envoi d'email
async function envoyerEmail(email, nouveauMotDePasse, nom) {
  // Configure ton transporter (ex: Gmail, mailtrap, etc.)
  let transporter = nodemailer.createTransport({
    service: 'Gmail', // ou smtp...
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });

  const messageHtml = `
    <h2>Bonjour ${nom},</h2>
    <p>Voici votre nouveau mot de passe temporaire :</p>
    <div style="font-size: 20px; font-weight: bold; color: #4f46e5; margin: 10px 0;">${nouveauMotDePasse}</div>
    <p>Pensez à le changer dès votre prochaine connexion !</p>
    <p>Merci d'utiliser Pictur'Art ✨</p>
  `;

  await transporter.sendMail({
    from: '"Pictur\'Art" <${process.env.EMAIL_USER}>',
    to: email,
    subject: '🔒 Nouveau mot de passe Pictur\'Art',
    html: messageHtml,
  });
}
