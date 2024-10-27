const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'test_steps', // Dossier où les images seront sauvegardées
    allowedFormats: ['jpeg', 'jpg', 'png'],
    use_filename: true,
    unique_filename: true,
  },
});

const upload = multer({ storage });

module.exports = upload;
