const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware pour vérifier l'authentification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'Token non fourni, accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajouter les informations de l'utilisateur au req
    next(); // Continuer à la prochaine étape
  } catch (err) {
    res.status(401).json({ message: 'Authentification échouée', error: err });
  }
};

module.exports = verifyToken;
