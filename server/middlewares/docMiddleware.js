const multer = require('multer');
const path = require('path');

// Configuration du stockage Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Assurez-vous que les fichiers sont enregistrés dans 'uploads'
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix); // Nommez les fichiers pour éviter les conflits
  }
});

// Filtrage des types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const mimeType = allowedFileTypes.test(file.mimetype);
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extname) {
    return cb(null, true);
  }
  cb(new Error('Seuls les fichiers images (jpeg, jpg, png) sont autorisés'));
};

// Configuration de Multer avec des limites de taille et filtrage des fichiers
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10 Mo par fichier
  },
  fileFilter, // Appliquer le filtrage des types de fichiers
});


module.exports = upload;
