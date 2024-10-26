const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAdmin = (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas administrateur" });
    }

    next(); // Continuer vers la route suivante si l'utilisateur est admin
  } catch (err) {
    res.status(401).json({ message: "Authentification échouée", error: err });
  }
};

module.exports = isAdmin;

