const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models');

// Middleware pour protéger les routes
const auth = async (req, res, next) => {
  try {
    // Récupération du token depuis le header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé - Token manquant' });
    }

    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupération de l'utilisateur complet avec ses relations
    const user = await Utilisateur.findByPk(decoded.user.id, {
      include: [
        {
          model: require('../models').Vendeur,
          as: 'vendeur'
        },
        {
          model: require('../models').Client,
          as: 'client'
        }
      ]
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Accès non autorisé - Utilisateur non trouvé' });
    }

    // Ajout de l'objet utilisateur complet et du token à la requête
    req.user = user;
    req.token = token;
    
    next();
  } catch (err) {
    console.error('Erreur d\'authentification:', err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide' });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    
    res.status(500).json({ message: 'Erreur serveur lors de l\'authentification' });
  }
};

// Middleware pour vérifier les rôles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Accès refusé - Rôle ${req.user.role} non autorisé` 
      });
    }
    next();
  };
};

module.exports = { auth, authorize };