const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware pour vérifier si l'utilisateur est lui-même, un administrateur, ou un superadmin
const isSelfOrAdmin = (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: 'Authentification échouée : Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decoded.id; // ID de l'utilisateur extrait du token
    const userRoleFromToken = decoded.role; // Rôle de l'utilisateur extrait du token
    const userIdFromParams = req.params.id; // ID passé dans les paramètres de la requête

    // Vérifier si l'utilisateur est lui-même, un admin ou un superadmin
    if (userIdFromToken === userIdFromParams || userRoleFromToken === 'admin' || userRoleFromToken === 'superadmin') {
      next(); // Autoriser l'accès
    } else {
      res.status(403).json({ message: "Accès refusé : vous n'avez pas les droits nécessaires" });
    }
  } catch (err) {
    console.error("Erreur lors de l'authentification :", err);
    res.status(401).json({ message: "Authentification échouée", error: err });
  }
};

module.exports = isSelfOrAdmin;
