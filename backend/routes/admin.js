const express = require('express');
const { getAllUsers, updateUserRole, getSellerRequests, manageSellerRequest } = require('../controllers/adminController');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Récupérer tous les utilisateurs
// @access  Privé/Admin
router.get('/users', auth, admin, getAllUsers);

// @route   PUT /api/admin/users/:id/role
// @desc    Mettre à jour le rôle d'un utilisateur
// @access  Privé/Admin
router.put('/users/:id/role', auth, admin, updateUserRole);

// @route   GET /api/admin/seller-requests
// @desc    Récupérer les demandes pour devenir vendeur
// @access  Privé/Admin
router.get('/seller-requests', auth, admin, getSellerRequests);

// @route   PUT /api/admin/seller-requests/:id
// @desc    Gérer une demande pour devenir vendeur
// @access  Privé/Admin
router.put('/seller-requests/:id', auth, admin, manageSellerRequest);

module.exports = router;
