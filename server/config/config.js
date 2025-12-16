// Charge les variables d’environnement définies dans le fichier .env
require('dotenv').config();

// Récupère la clé secrète 
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET manquant dans .env");
}

module.exports = {
  SECRET_KEY,
};
