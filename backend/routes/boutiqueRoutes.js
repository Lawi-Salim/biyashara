const express = require('express');
const router = express.Router();
const boutiqueController = require('../controllers/boutiqueController');
const { auth, authorize } = require('../middleware/auth');
const boutiqueUpload = require('../middleware/boutiqueUpload');

// @route   GET /api/v1/boutiques
// @desc    Récupérer toutes les boutiques actives
// @access  Public
router.get('/', boutiqueController.getAllBoutiques);

// @route   GET /api/v1/boutiques/slug/:slug
// @desc    Récupérer une boutique par son slug
// @access  Public
router.get('/slug/:slug', boutiqueController.getBoutiqueBySlug);

// @route   GET /api/v1/boutiques/my-shop
// @desc    Récupérer la boutique du vendeur connecté
// @access  Private (Vendeur)
router.get('/my-shop', [auth, authorize('vendeur')], boutiqueController.getMaBoutique);

// @route   POST /api/v1/boutiques/my-shop
// @desc    Créer ou mettre à jour la boutique du vendeur connecté
// @access  Private (Vendeur)
router.post('/my-shop', [auth, authorize('vendeur'), boutiqueUpload], boutiqueController.createOrUpdateBoutique);

module.exports = router;
