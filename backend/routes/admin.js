const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, getSellerRequests, manageSellerRequest } = require('../controllers/adminController');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// @route   GET /api/admin/users
// @desc    Récupérer tous les utilisateurs (pour les admins)
// @access  Privé/Admin
router.get('/users', [auth, admin], getAllUsers);

// @route   PUT /api/admin/users/:id/role
// @desc    Mettre à jour le rôle d'un utilisateur (pour les admins)
// @access  Privé/Admin
router.put('/users/:id/role', [auth, admin], updateUserRole);

// @route   GET /api/admin/seller-requests
// @desc    Récupérer les demandes pour devenir vendeur
// @access  Privé/Admin
router.get('/seller-requests', [auth, admin], getSellerRequests);

// @route   POST /api/admin/seller-requests/:id
// @desc    Approuver ou rejeter une demande vendeur
// @access  Privé/Admin
router.post('/seller-requests/:id', [auth, admin], manageSellerRequest);

module.exports = router;
