const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');
const nodemailer = require('nodemailer');
const CodeTemporaire = require('../models/CodeTemporaire'); 
const { SECRET_KEY } = require('../config/config');


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
    return res.status(400).json({ success: false, message: "Email requis." });
  }

  try {
    const utilisateur = await Utilisateur.findOne({ email });

    if (!utilisateur) {
      return res.status(200).json({ success: false, message: "Si votre compte existe, vous recevrez un code par email" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = new Date(Date.now() + 15 * 60 * 1000);

    await CodeTemporaire.create({ email, code, expireAt });
    await envoyerEmailCode(email, code, utilisateur.nom);

    res.status(200).json({ success: true, message: "Code envoyé à votre adresse email." });
  } catch (error) {
    console.error("Erreur lors de la génération du code :", error);
    res.status(500).json({ success: false, message: "Erreur serveur", error });
  }
};


exports.changerMotDePasse = async (req, res) => {
  const { email, code, nouveauMotDePasse } = req.body;
  console.log("changerMotDePasse body:", req.body);
  if (!email || !code || !nouveauMotDePasse) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const record = await CodeTemporaire.findOne({ email, code });

    if (!record) {
      return res.status(400).json({ message: "Code invalide ou expiré." });
    }

    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    utilisateur.mot_de_passe = nouveauMotDePasse;
    await utilisateur.save();

    await CodeTemporaire.deleteOne({ _id: record._id });

    res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};



// Envoi d'email
async function envoyerEmailCode(email, code, nom) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <h2>Bonjour ${nom},</h2>
    <p>Voici votre <strong>code temporaire</strong> pour réinitialiser votre mot de passe :</p>
    <div style="font-size: 24px; font-weight: bold; color: #4f46e5;">${code}</div>
    <p>Ce code est valable 15 minutes.</p>
    <p>Merci d'utiliser Pictur'Art ✨</p>
  `;

  await transporter.sendMail({
    from: `"Pictur'Art" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Votre code de réinitialisation',
    html
  });
}


exports.verifierCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: "Email et code requis." });
  }

  try {
    const CodeTemporaire = require('../models/CodeTemporaire');

    const record = await CodeTemporaire.findOne({ email, code })
      .sort({ expireAt: -1 });

    if (!record) {
      return res.status(400).json({ success: false, message: "Code invalide." });
    }

    const now = new Date();
    if (record.expireAt < now) {
      return res.status(400).json({ success: false, message: "Code expiré." });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Erreur lors de la vérification du code :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// PUT /api/utilisateurs/modifier
exports.modifierProfil = async (req, res) => {
  const { nom, ancienMotDePasse, nouveauMotDePasse, confirmation, email } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ email });
    
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (!nom.trim()) {
      return res.status(400).json({ message: "Le pseudo est requis." });
    }

    utilisateur.nom = nom;
    console.log("ancienMotDePasse:",ancienMotDePasse,"\nnouveauMotDePasse:",nouveauMotDePasse,"\nconfirmation:",confirmation);

    // Si modification du mot de passe
    if (ancienMotDePasse || nouveauMotDePasse || confirmation) {
      if (!ancienMotDePasse || !nouveauMotDePasse || !confirmation) {
        return res.status(400).json({ message: "Tous les champs du mot de passe doivent être remplis." });
      }

      const passwordOk = await bcrypt.compare(ancienMotDePasse, utilisateur.mot_de_passe);
      console.log('\npasswordOk:',passwordOk);
      
      if (!passwordOk) {
        return res.status(401).json({ message: "Ancien mot de passe incorrect." });
      }

      if (nouveauMotDePasse !== confirmation) {
        return res.status(400).json({ message: "Les nouveaux mots de passe ne correspondent pas." });
      }

      utilisateur.mot_de_passe = nouveauMotDePasse;
    }

    await utilisateur.save();
    res.status(200).json({ message: "Profil mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur modification profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
  router.get('/by-pseudo/:pseudo', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findOne({ nom: req.params.pseudo });
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(utilisateur);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

};

exports.contact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"PicturArt Contact" <${process.env.EMAIL_USER}>`,
    to: 'support@picturart.fr',
    subject: `Demande de contact : ${subject}`,
    html: `
      <h3>Nouvelle demande de contact</h3>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Sujet :</strong> ${subject}</p>
      <p><strong>Message :</strong><br/>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur envoi email :', error);
    res.status(500).json({ error: "Échec de l'envoi de l'email" });
  }
};

