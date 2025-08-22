const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/`;
const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Construit l'URL complète d'une image à partir de son identifiant.
 * @param {string} identifier - Le public_id de Cloudinary ou le chemin relatif d'une image locale.
 * @returns {string|null} L'URL complète de l'image, ou null si l'identifiant est vide.
 */
export const getImageUrl = (identifier) => {
  if (!identifier) {
    return null; // Ou une image par défaut
  }

  // Si l'identifiant est déjà une URL complète, le retourner tel quel.
  // Utile pour les aperçus d'images locales (URL.createObjectURL).
  if (identifier.startsWith('http') || identifier.startsWith('blob:')) {
    return identifier;
  }

  // S'il s'agit d'une bannière de la galerie (chemin relatif).
  if (identifier.startsWith('/banners/')) {
    return `${API_BASE_URL}${identifier}`;
  }

  // Sinon, on suppose que c'est un public_id de Cloudinary.
  return `${CLOUDINARY_BASE_URL}${identifier}`;
};
