const express = require('express');
const router = express.Router();
const { getVendeurCategories, updateVendeurCategories, getAllFamilles } = require('../controllers/vendeurCategorieController');
const { auth } = require('../middleware/auth');
const { vendeur } = require('../middleware/vendeur');

// Middleware d'authentification pour toutes les routes
router.use((req, res, next) => auth(req, res, next));
router.use((req, res, next) => vendeur(req, res, next));

// GET /api/v1/vendeur-categories - Récupérer les préférences du vendeur connecté
router.get('/', getVendeurCategories);

// PUT /api/v1/vendeur-categories - Mettre à jour les préférences du vendeur connecté
router.put('/', updateVendeurCategories);

// GET /api/v1/vendeur-categories/familles - Récupérer toutes les grandes familles
router.get('/familles', getAllFamilles);

module.exports = router;
