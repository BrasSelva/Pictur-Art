require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET manquant dans .env");
}

module.exports = {
  SECRET_KEY,
};
