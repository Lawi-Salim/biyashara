const API_IMAGE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/v1/produits/images/`;

// Fonction pour gérer les erreurs d'images
export const handleImageError = (event) => {
  console.log('❌ Erreur de chargement image:', event.target.src);
  event.target.src = '/favicon.png'; // Image par défaut
  event.target.onerror = null; // Éviter les boucles infinies
};

// Fonction pour construire l'URL de l'image
export const getImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl === 'default.png' || imageUrl === 'default.jpg') {
    return '/favicon.png'; // Image par défaut
  }
  // Si c'est une URL Cloudinary, l'utiliser directement
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  // Sinon, utiliser l'ancienne méthode (pour compatibilité)
  return API_IMAGE_URL + imageUrl;
};
