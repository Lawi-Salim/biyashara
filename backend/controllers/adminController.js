const { Utilisateur, Vendeur, Boutique, DevenirVendeur } = require('../models');
const sequelize = require('../database').sequelize;

// @desc    Récupérer tous les utilisateurs
// @route   GET /api/admin/users
// @access  Privé/Admin
// @desc    Récupérer tous les vendeurs
// @route   GET /api/admin/vendeurs
// @access  Privé/Admin
exports.getAllVendeurs = async (req, res) => {
  try {
    const vendeurs = await Utilisateur.findAll({
      where: { role: 'vendeur' },
      include: [{
        model: Vendeur,
        as: 'vendeur',
        required: true
      }],
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
    res.json(vendeurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des vendeurs:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

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

// @desc    Approuver une demande vendeur
// @route   POST /api/admin/seller-requests/:id/approve
// @access  Privé/Admin
exports.approveSellerRequest = async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction();

  try {
    const request = await DevenirVendeur.findByPk(id);
    if (!request) {
      await t.rollback();
      return res.status(404).json({ message: 'Demande non trouvée.' });
    }

    // 1. Créer l'utilisateur
    const newUser = await Utilisateur.create({
      nom: request.nom,
      email: request.email,
      password: request.password,
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

  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de l\'approbation de la demande:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'approbation.' });
  }
};

// @desc    Refuser une demande vendeur
// @route   POST /api/admin/seller-requests/:id/decline
// @access  Privé/Admin
exports.declineSellerRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await DevenirVendeur.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Demande non trouvée.' });
    }

    await request.destroy();
    res.json({ message: 'La demande a été rejetée.' });

  } catch (error) {
    console.error('Erreur lors du rejet de la demande:', error);
    res.status(500).json({ message: 'Erreur serveur lors du rejet.' });
  }
};

// @desc    Déverrouiller les catégories d'un vendeur
// @route   PUT /api/admin/vendeurs/:id/unlock-categories
// @access  Privé/Admin
exports.unlockVendeurCategories = async (req, res) => {
  try {
    const vendeur = await Vendeur.findByPk(req.params.id);

    if (!vendeur) {
      return res.status(404).json({ message: 'Vendeur non trouvé' });
    }

    vendeur.categories_verrouillees = false;
    await vendeur.save();

    res.json({ message: 'Les catégories du vendeur ont été déverrouillées avec succès.' });
  } catch (error) {
    console.error('Erreur lors du déverrouillage des catégories:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
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
