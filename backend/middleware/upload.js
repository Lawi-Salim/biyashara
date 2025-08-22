const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configuration du stockage Cloudinary pour Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Sanitize user name pour l'URL
    const userName = req.user.nom.replace(/\s+/g, '-').toLowerCase();
    const folderPath = `biyashara/produits/${userName}-${req.user.id_user}`;

    return {
      folder: folderPath,
      public_id: `${file.originalname.split('.')[0]}-${Date.now()}`,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    };
  }
});

// Configuration de Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés.'), false);
    }
  }
});

module.exports = upload;
