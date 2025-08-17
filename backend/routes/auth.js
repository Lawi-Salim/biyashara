const express = require('express');
const { check } = require('express-validator');
const { login, register, getProfile, updateProfile, registerSellerRequest } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Enregistrer un nouvel utilisateur
// @access  Public
router.post(
  '/register',
  [
    check('nom', 'Le nom est requis').not().isEmpty(),
    check('email', 'Veuillez fournir un email valide').isEmail(),
    check('password', 'Veuillez entrer un mot de passe de 6 caractères ou plus').isLength({ min: 6 })
  ],
  register
);

// @route   POST /api/auth/login
// @desc    Connecter un utilisateur et obtenir un token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Veuillez fournir un email valide').isEmail(),
    check('password', 'Le mot de passe est requis').exists()
  ],
  login
);

// @route   GET /api/auth/me
// @desc    Obtenir le profil de l'utilisateur connecté
// @access  Privé
router.get('/me', auth, getProfile);

// @route   PUT /api/auth/me
// @desc    Mettre à jour le profil de l'utilisateur connecté
// @access  Privé
router.put(
  '/me',
  [
    auth,
    check('nom', 'Le nom est requis').optional().not().isEmpty(),
    check('email', 'Veuillez fournir un email valide').optional().isEmail(),
    check('telephone', 'Numéro de téléphone invalide').optional().isMobilePhone()
  ],
  updateProfile
);

// @route   POST /api/auth/register-seller-request
// @desc    Soumettre une demande pour devenir vendeur
// @access  Public
router.post(
  '/register-seller-request',
  [
    check('nom', 'Le nom est requis').not().isEmpty(),
    check('email', 'Veuillez fournir un email valide').isEmail(),
    check('password', 'Veuillez entrer un mot de passe de 6 caractères ou plus').isLength({ min: 6 }),
    check('nom_boutique', 'Le nom de la boutique est requis').not().isEmpty()
  ],
  registerSellerRequest
);

module.exports = router;