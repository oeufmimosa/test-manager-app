const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware pour vérifier l'authentification
const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken; // Lire le token depuis le cookie

  console.log("Token reçu pour vérification :", token); // Log du token

  if (!token) {
    console.log("Aucun token trouvé. Accès refusé.");
    return res.status(401).json({ message: 'Accès refusé, token non fourni' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé :", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Erreur lors de la vérification du token :", err);
    res.status(401).json({ message: 'Token invalide ou expiré', error: err });
  }
};


module.exports = verifyToken;