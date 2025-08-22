// Middleware pour vérifier si l'utilisateur a le rôle 'vendeur'
const vendeur = (req, res, next) => {
  // Ce middleware doit être utilisé APRÈS le middleware 'auth'
  if (req.user && req.user.role === 'vendeur') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé. Seuls les vendeurs sont autorisés.' });
  }
};

module.exports = { vendeur };
