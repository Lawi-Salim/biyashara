const express = require('express');
const {
  getNotifications,
  markAsRead,
  getAdminNotifications,
  getVendeurNotifications,
  getClientNotifications,
  getNotificationTypes,
  getUnreadNotificationsCount
} = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Récupérer toutes les notifications de l'utilisateur
// @access  Privé
// @route   GET /api/notifications/admin
// @desc    Récupérer les notifications pour l'admin
// @access  Admin
router.get('/admin', auth, admin, getAdminNotifications);

// @route   GET /api/notifications/vendeur
// @desc    Récupérer les notifications pour le vendeur
// @access  Vendeur (Privé)
router.get('/vendeur', auth, getVendeurNotifications);

// @route   GET /api/notifications/client
// @desc    Récupérer les notifications pour le client
// @access  Client (Privé)
router.get('/client', auth, getClientNotifications);

// @route   GET /api/notifications/types
// @desc    Récupérer tous les types de notifications
// @access  Privé
router.get('/types', auth, getNotificationTypes);

// @route   GET /api/notifications/count
// @desc    Compter les notifications non lues
// @access  Privé
router.get('/count', auth, getUnreadNotificationsCount);

// @route   PUT /api/notifications/:id/read
// @desc    Marquer une notification comme lue
// @access  Privé
router.put('/:id/read', auth, markAsRead);

module.exports = router;
