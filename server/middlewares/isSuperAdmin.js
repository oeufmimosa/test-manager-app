const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware pour vérifier si l'utilisateur est superadmin
const isSuperAdmin = (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas superadmin" });
    }

    next(); // Continuer si l'utilisateur est superadmin
  } catch (err) {
    res.status(401).json({ message: "Authentification échouée", error: err });
  }
};

module.exports = isSuperAdmin;
