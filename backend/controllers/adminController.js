const { Utilisateur, Vendeur, Boutique, DevenirVendeur } = require('../models');
const sequelize = require('../database').sequelize;

// @desc    Récupérer tous les utilisateurs
// @route   GET /api/admin/users
// @access  Privé/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Utilisateur.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// @desc    Mettre à jour le rôle d'un utilisateur
// @route   PUT /api/admin/users/:id/role
// @access  Privé/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await Utilisateur.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Valider le rôle
    const validRoles = ['client', 'vendeur', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Rôle non valide' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'Rôle de l\'utilisateur mis à jour avec succès', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// @desc    Récupérer les demandes pour devenir vendeur
// @route   GET /api/admin/seller-requests
// @access  Privé/Admin
exports.manageSellerRequest = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve' or 'reject'

  const t = await sequelize.transaction();

  try {
    const request = await DevenirVendeur.findByPk(id);

    if (!request) {
      await t.rollback();
      return res.status(404).json({ message: 'Demande non trouvée.' });
    }

    if (action === 'approve') {
      // 1. Créer l'utilisateur
      const newUser = await Utilisateur.create({
        nom: request.nom,
        email: request.email,
        password: request.password, // Le mot de passe est déjà haché
        telephone: request.telephone,
        role: 'vendeur'
      }, { transaction: t });

      // 2. Créer le vendeur
      const newSeller = await Vendeur.create({
        id_user: newUser.id_user,
        nationalite: request.nationalite,
        statut: 'active'
      }, { transaction: t });

      // 3. Créer la boutique
      await Boutique.create({
        nom_boutique: request.nom_boutique,
        description: `Boutique de ${request.nom}`,
        adresse_boutique: 'Non spécifiée',
        id_vendeur: newSeller.id_vendeur
      }, { transaction: t });

      // 4. Supprimer la demande
      await request.destroy({ transaction: t });

      await t.commit();
      res.json({ message: 'La demande a été approuvée avec succès.' });

    } else if (action === 'reject') {
      await request.destroy({ transaction: t });
      await t.commit();
      res.json({ message: 'La demande a été rejetée.' });

    } else {
      await t.rollback();
      res.status(400).json({ message: 'Action non valide.' });
    }
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors du traitement de la demande vendeur:', error);
    res.status(500).json({ message: 'Erreur serveur lors du traitement de la demande.' });
  }
};

exports.getSellerRequests = async (req, res) => {
  try {
    const requests = await DevenirVendeur.findAll({
      where: { statut: 'en_attente' },
      order: [['created_at', 'ASC']]
    });
    res.json(requests);
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes vendeur:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};
