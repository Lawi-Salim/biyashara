const express = require('express');
const router = express.Router();
const { getAllUnites, getUnitesByCategories } = require('../controllers/uniteController');

// @route   GET api/v1/unites
// @desc    Récupérer toutes les unites
// @access  Public
router.get('/', getAllUnites);

// @route   POST api/v1/unites/by-categories
// @desc    Récupérer les unités pour une liste de catégories
// @access  Public (ou Private si nécessaire)
router.post('/by-categories', getUnitesByCategories);

module.exports = router;
