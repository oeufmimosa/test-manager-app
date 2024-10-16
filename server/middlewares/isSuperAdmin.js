const jwt = require('jsonwebtoken');

// Middleware pour vérifier si l'utilisateur est superadmin
const isSuperAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '123456');

    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas superadmin" });
    }

    next(); // Continuer si l'utilisateur est superadmin
  } catch (err) {
    res.status(401).json({ message: "Authentification échouée", error: err });
  }
};

module.exports = isSuperAdmin;
