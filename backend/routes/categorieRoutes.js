const express = require('express');
const router = express.Router();
const { getAllCategories, getUnitesByCategorie } = require('../controllers/categorieController');

// @route   GET api/v1/categories
// @desc    Récupérer toutes les categories
// @access  Public
router.get('/', getAllCategories);

// @route   GET api/v1/categories/:id/unites
// @desc    Récupérer les unités pour une catégorie spécifique
// @access  Public
router.get('/:id/unites', getUnitesByCategorie);

module.exports = router;
