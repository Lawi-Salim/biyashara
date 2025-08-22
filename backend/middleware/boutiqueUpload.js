const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configuration du stockage Cloudinary pour les images de la boutique
const boutiqueStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const userName = req.user.nom.replace(/\s+/g, '-').toLowerCase();
    const folderPath = `biyashara/boutiques/${userName}-${req.user.id_user}`;

    return {
      folder: folderPath,
      public_id: `${file.fieldname}-${Date.now()}`,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: file.fieldname === 'logo_boutique' 
        ? [{ width: 300, height: 300, crop: 'fill' }]
        : [{ width: 1200, height: 400, crop: 'fill' }]
    };
  }
});

// Configuration de Multer pour les images de la boutique
const boutiqueUpload = multer({
  storage: boutiqueStorage,
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
}).fields([
  { name: 'logo_boutique', maxCount: 1 },
  { name: 'banniere_boutique', maxCount: 1 }
]);

module.exports = boutiqueUpload;
