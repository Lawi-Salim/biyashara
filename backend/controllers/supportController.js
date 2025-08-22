const { SupportTicket, Vendeur, Utilisateur, Boutique, Notification } = require('../models');
const { Op } = require('sequelize');

// @desc    Créer un nouveau ticket de support
// @route   POST /api/v1/support/tickets
// @access  Private (Vendeur)
exports.createTicket = async (req, res) => {
  const { raison } = req.body;
  const id_user = req.user.id_user;

  if (!raison) {
    return res.status(400).json({ message: 'La raison de la demande est requise.' });
  }

  try {
    const vendeur = await Vendeur.findOne({ where: { id_user } });
    if (!vendeur) {
      return res.status(404).json({ message: 'Vendeur non trouvé.' });
    }

    // Anti-spam: Vérifier si un ticket est déjà ouvert
    const existingTicket = await SupportTicket.findOne({
      where: {
        vendeur_id: vendeur.id_vendeur,
        status: 'ouvert',
      },
    });

    if (existingTicket) {
      return res.status(409).json({ message: 'Vous avez déjà une demande en cours de traitement.' });
    }

    const ticket = await SupportTicket.create({
      vendeur_id: vendeur.id_vendeur,
      raison,
    });

    // Générer une notification pour tous les admins
    const admins = await Utilisateur.findAll({ where: { role: 'admin' } });
    const boutique = await vendeur.getBoutique();
    const messageAdmin = `Nouvelle demande de support de ${boutique?.nom_boutique || 'un vendeur'} pour le déverrouillage des catégories.`;

    for (const admin of admins) {
      await Notification.create({
        id_user: admin.id_user,
        message: messageAdmin,
        id_type_notif: 3, // 3 = 'Système' ou 'Support'
        id_support_ticket: ticket.id
      });
    }

    res.status(201).json({ message: 'Votre demande a été envoyée avec succès. Vous recevrez une réponse prochainement.', ticket });
  } catch (error) {
    console.error('Erreur lors de la création du ticket:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du ticket.' });
  }
};

exports.getTicketStatusForVendeur = async (req, res) => {
  const id_user = req.user.id_user;

  try {
    const vendeur = await Vendeur.findOne({ where: { id_user } });
    if (!vendeur) {
      return res.status(404).json({ message: 'Vendeur non trouvé.' });
    }

    const ticket = await SupportTicket.findOne({
      where: {
        vendeur_id: vendeur.id_vendeur,
      },
      order: [['created_at', 'DESC']],
      include: [{ model: Utilisateur, as: 'adminHandler', attributes: ['nom'], required: false }]
    });

    if (ticket) {
      return res.json({ ticket });
    }

    res.json({ ticket: null });

  } catch (error) {
    console.error('Erreur lors de la récupération du statut du ticket:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// @desc    Récupérer tous les tickets de support (pour admin)
// @route   GET /api/v1/admin/support/tickets
// @access  Private (Admin)
exports.getTickets = async (req, res) => {
  let { status, sortBy = 'created_at', order = 'desc' } = req.query;

  // Mapper le camelCase du frontend au snake_case de la BDD pour le tri
  if (sortBy === 'createdAt') {
    sortBy = 'created_at';
  }

  try {
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const tickets = await SupportTicket.findAll({
      attributes: {
        include: [
          ['created_at', 'createdAt'] // Alias pour le frontend
        ]
      },
      where: whereClause,
      include: [
        {
          model: Vendeur,
          as: 'vendeur',
          include: [
            { model: Utilisateur, as: 'utilisateur', attributes: ['nom', 'email'] },
            { model: Boutique, as: 'boutique', attributes: ['nom_boutique'] } // Inclusion de la boutique
          ]
        },
        {
          model: Utilisateur,
          as: 'adminHandler',
          attributes: ['nom'],
          required: false
        }
      ],
      order: [[sortBy, order.toUpperCase()]],
    });

    res.status(200).json({ tickets });
  } catch (error) {
    console.error('Erreur lors de la récupération des tickets:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// @desc    Mettre à jour le statut d'un ticket (pour admin)
// @route   PUT /api/v1/admin/support/tickets/:id
// @access  Private (Admin)
exports.updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const admin_id = req.user.id_user;

  if (!status || !['accepté', 'refusé'].includes(status)) {
    return res.status(400).json({ message: 'Statut invalide.' });
  }

  try {
    const ticket = await SupportTicket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé.' });
    }

    ticket.status = status;
    ticket.admin_id = admin_id;
    await ticket.save();

    // Si accepté, déverrouiller les catégories du vendeur
    if (status === 'accepté') {
        const vendeur = await Vendeur.findByPk(ticket.vendeur_id);
        if (vendeur) {
            vendeur.categories_verrouillees = false;
            await vendeur.save();
        }
    }

    // Générer une notification pour le vendeur
    const vendeur = await Vendeur.findByPk(ticket.vendeur_id);
    if (vendeur) {
      const messageVendeur = `Votre demande de support a été ${status}.`;
      await Notification.create({
        id_user: vendeur.id_user,
        message: messageVendeur,
        id_type_notif: 3, // 3 = 'Système' ou 'Support'
      });
    }

    res.status(200).json({ message: `Le ticket a été marqué comme ${status}.`, ticket });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du ticket:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
