const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware pour vérifier si l'utilisateur est lui-même ou un administrateur
const isSelfOrAdmin = (req, res, next) => {
  try {
    // Récupérer le token JWT de l'en-tête Authorization
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userIdFromToken = decoded.id; // ID de l'utilisateur extrait du token
    const userRoleFromToken = decoded.role; // Rôle de l'utilisateur extrait du token
    const userIdFromParams = req.params.id; // ID passé dans les paramètres de la requête

    // Vérifier si l'utilisateur est lui-même ou un admin
    if (userIdFromToken === userIdFromParams || userRoleFromToken === 'admin') {
      next(); // Autoriser l'accès
    } else {
      res.status(403).json({ message: "Accès refusé : vous n'avez pas les droits nécessaires" });
    }
  } catch (err) {
    res.status(401).json({ message: "Authentification échouée", error: err });
  }
};

module.exports = isSelfOrAdmin;
