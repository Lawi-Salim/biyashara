const db = require('../models');

// @desc    Récupérer toutes les notifications pour l'utilisateur connecté
// @route   GET /api/notifications
// @access  Privé
exports.getNotifications = async (req, res) => {
  try {
    const { type } = req.query;
    const whereClause = { id_user: req.user.id_user };

    if (type) {
      whereClause.id_type_notif = type;
    }

    const notifications = await db.Notification.findAll({
      where: whereClause,
      include: [{
        model: db.TypesNotification,
        as: 'type_notification',
        attributes: ['libelle']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// @desc    Marquer une notification comme lue
// @route   PUT /api/notifications/:id/read
// @access  Privé
// @desc    Récupérer les notifications pour un admin
// @route   GET /api/notifications/admin
// @access  Admin
exports.getAdminNotifications = async (req, res) => {
    try {
    const { type } = req.query;
    const whereClause = { id_user: req.user.id_user }; // Ne montrer que les notifs de l'admin connecté

    if (type) {
      whereClause.id_type_notif = type;
    }

    const notifications = await db.Notification.findAll({ 
      where: whereClause,
      include: [
        {
          model: db.TypesNotification,
          as: 'type_notification',
          attributes: ['libelle']
        },
        {
          model: db.DevenirVendeur,
          as: 'demande_vendeur',
          required: false
        },
        {
                    model: db.SupportTicket,
          as: 'support_ticket',
          required: false,
          include: [
            {
                            model: db.Vendeur,
              as: 'vendeur',
              include: [
                { model: db.Utilisateur, as: 'utilisateur', attributes: ['nom', 'email'] },
                                { model: db.Boutique, as: 'boutique', attributes: ['nom_boutique'] }
              ]
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications admin:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// @desc    Récupérer les notifications pour un vendeur
// @route   GET /api/notifications/vendeur
// @access  Privé
exports.getVendeurNotifications = async (req, res) => {
  try {
    const { type } = req.query;
    const whereClause = { id_user: req.user.id_user };

    if (type) {
      whereClause.id_type_notif = type;
    }

    const notifications = await db.Notification.findAll({
      where: whereClause,
      include: [{
        model: db.TypesNotification,
        as: 'type_notification',
        attributes: ['libelle']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications vendeur:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// @desc    Récupérer les notifications pour un client
// @route   GET /api/notifications/client
// @access  Privé
// @desc    Récupérer tous les types de notifications
// @route   GET /api/notifications/types
// @access  Privé
// @desc    Compter les notifications non lues
// @route   GET /api/notifications/count
// @access  Privé
exports.getUnreadNotificationsCount = async (req, res) => {
  try {
    const count = await db.Notification.count({
      where: {
        id_user: req.user.id_user,
        notif_lu: false
      }
    });
    res.json({ count });
  } catch (error) {
    console.error('Erreur lors du comptage des notifications non lues:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

exports.getNotificationTypes = async (req, res) => {
  try {
    const types = await db.TypesNotification.findAll({ order: [['libelle', 'ASC']] });
    res.json(types);
  } catch (error) {
    console.error('Erreur lors de la récupération des types de notifications:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

exports.getClientNotifications = async (req, res) => {
  try {
    const { type } = req.query;
    const whereClause = { id_user: req.user.id_user };

    if (type) {
      whereClause.id_type_notif = type;
    }

    const notifications = await db.Notification.findAll({
      where: whereClause,
      include: [{
        model: db.TypesNotification,
        as: 'type_notification',
        attributes: ['libelle']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications client:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await db.Notification.findOne({
      where: {
        id_notif: req.params.id,
        id_user: req.user.id_user // Sécurité : ne modifier que ses propres notifications
      }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    notification.notif_lu = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};
