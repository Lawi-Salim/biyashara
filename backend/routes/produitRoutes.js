const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { body } = require('express-validator');

// @route   POST api/v1/produits
// @desc    Créer un produit
// @access  Private (Vendeur)
router.post(
  '/',
  [
    auth,
    authorize('vendeur'),
    upload.single('image'),
    body('nom', 'Le nom du produit est requis').not().isEmpty(),
    body('prix_unite', 'Le prix est requis et doit être un nombre').isNumeric(),
    body('id_categorie', 'La catégorie est requise').isInt(),
    body('id_unite', "L'unité de mesure est requise").isInt(),
  ],
  produitController.createProduit
);

// @route   GET api/v1/produits/vendeur
// @desc    Récupérer les produits du vendeur connecté
// @access  Private (Vendeur)
router.get('/vendeur', [auth, authorize('vendeur')], produitController.getVendeurProduits);

// @route   PUT api/v1/produits/:id
// @desc    Mettre à jour un produit
// @access  Private (Vendeur)
router.put('/:id', [auth, authorize('vendeur')], produitController.updateProduit);

// @route   GET api/v1/produits/all
// @desc    Récupérer tous les produits (pour l'admin)
// @access  Private (Admin)
router.get('/all', [auth, authorize('admin')], produitController.getAllProduits);

module.exports = router;
