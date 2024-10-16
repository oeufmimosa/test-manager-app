const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Récupérer le token JWT depuis le header
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas administrateur" });
    }

    next(); // Continuer vers la route suivante si l'utilisateur est admin
  } catch (err) {
    res.status(401).json({ message: "Authentification échouée", error: err });
  }
};

module.exports = isAdmin;

