const express = require('express');
const router = express.Router();
const { getTickets, updateTicketStatus } = require('../controllers/supportController');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/v1/admin/support/tickets
// @desc    Récupérer tous les tickets de support
// @access  Private (Admin)
router.get('/tickets', auth, authorize('admin'), getTickets);

// @route   PUT /api/v1/admin/support/tickets/:id
// @desc    Mettre à jour le statut d'un ticket
// @access  Private (Admin)
router.put('/tickets/:id', auth, authorize('admin'), updateTicketStatus);

module.exports = router;
