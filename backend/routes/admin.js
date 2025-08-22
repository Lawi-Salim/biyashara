const express = require('express');
const router = express.Router();
const { 
  getAllVendeurs,
  getAllUsers, 
  updateUserRole, 
  getSellerRequests, 
  approveSellerRequest, 
  declineSellerRequest, 
  unlockVendeurCategories
} = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/admin/users
// @desc    Récupérer tous les utilisateurs (pour les admins)
// @access  Privé/Admin
// @route   GET /api/admin/vendeurs
// @desc    Récupérer tous les vendeurs (pour les admins)
// @access  Privé/Admin
router.get('/vendeurs', [auth, authorize('admin')], getAllVendeurs);

router.get('/users', [auth, authorize('admin')], getAllUsers);

// @route   PUT /api/admin/users/:id/role
// @desc    Mettre à jour le rôle d'un utilisateur (pour les admins)
// @access  Privé/Admin
router.put('/users/:id/role', [auth, authorize('admin')], updateUserRole);

// @route   GET /api/admin/seller-requests
// @desc    Récupérer les demandes pour devenir vendeur
// @access  Privé/Admin
router.get('/seller-requests', [auth, authorize('admin')], getSellerRequests);

// @route   POST /api/admin/seller-requests/:id/approve
// @desc    Approuver une demande vendeur
// @access  Privé/Admin
router.post('/seller-requests/:id/approve', [auth, authorize('admin')], approveSellerRequest);

// @route   POST /api/admin/seller-requests/:id/decline
// @desc    Refuser une demande vendeur
// @access  Privé/Admin
router.post('/seller-requests/:id/decline', [auth, authorize('admin')], declineSellerRequest);

// @route   PUT /api/admin/vendeurs/:id/unlock-categories
// @desc    Déverrouiller les catégories d'un vendeur
// @access  Privé/Admin
router.put('/vendeurs/:id/unlock-categories', [auth, authorize('admin')], unlockVendeurCategories);

module.exports = router;
