const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { auth, authorize } = require('../middleware/auth');

// @route   POST /api/v1/support/tickets
// @desc    Créer un nouveau ticket de support
// @access  Private (Vendeur)
router.post('/tickets', auth, authorize('vendeur'), supportController.createTicket);
router.get('/tickets/status', auth, authorize('vendeur'), supportController.getTicketStatusForVendeur);

module.exports = router;
