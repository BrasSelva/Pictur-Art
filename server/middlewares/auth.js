const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;


module.exports = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.utilisateur = decoded;  
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};
