const { VendeurCategorie, Categorie, Vendeur } = require('../models');
const { Op } = require('sequelize');

// Récupérer les préférences catégories d'un vendeur
const getVendeurCategories = async (req, res) => {
  try {
    // Vérifier si l'utilisateur a un profil vendeur
    if (!req.user.vendeur || !req.user.vendeur.id_vendeur) {
      return res.status(400).json({ 
        message: 'Profil vendeur non trouvé pour cet utilisateur' 
      });
    }
    
    const vendeurId = req.user.vendeur.id_vendeur;

    // Récupérer les catégories préférées du vendeur
    const preferences = await VendeurCategorie.findAll({
      where: { id_vendeur: vendeurId },
      include: [{
        model: Categorie,
        as: 'categorie',
        include: [{
          model: Categorie,
          as: 'sousCategories',
          where: { niveau: 2 },
          required: false
        }]
      }]
    });

    // Si pas de préférences, retourner toutes les grandes familles
    if (preferences.length === 0) {
      const toutesFamilles = await Categorie.findAll({
        where: { niveau: 1 },
        include: [{
          model: Categorie,
          as: 'sousCategories',
          where: { niveau: 2 },
          required: false
        }],
        order: [['ordre_affichage', 'ASC'], [{ model: Categorie, as: 'sousCategories' }, 'ordre_affichage', 'ASC']]
      });

      return res.json({
        success: true,
        data: {
          famillesPreferees: [],
          toutesFamilles,
          sousCategories: []
        }
      });
    }

    // Extraire les sous-catégories des familles préférées
    const sousCategories = [];
    preferences.forEach(pref => {
      if (pref.categorie && pref.categorie.sousCategories) {
        sousCategories.push(...pref.categorie.sousCategories);
      }
    });

    res.json({
      success: true,
      data: {
        famillesPreferees: preferences.map(p => p.categorie),
        sousCategories: sousCategories.sort((a, b) => a.ordre_affichage - b.ordre_affichage)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des préférences catégories'
    });
  }
};

// Mettre à jour les préférences catégories d'un vendeur
const updateVendeurCategories = async (req, res) => {
  try {
    // Vérifier si l'utilisateur a un profil vendeur
    if (!req.user.vendeur || !req.user.vendeur.id_vendeur) {
      return res.status(400).json({ 
        message: 'Profil vendeur non trouvé pour cet utilisateur' 
      });
    }
    
    const vendeurId = req.user.vendeur.id_vendeur;

    // Récupérer le vendeur pour vérifier le statut de verrouillage
    const vendeur = await Vendeur.findByPk(vendeurId);
    if (!vendeur) {
        return res.status(404).json({ success: false, message: 'Vendeur non trouvé.' });
    }

    // Si les catégories sont déjà verrouillées, interdire la modification
    if (vendeur.categories_verrouillees) {
        return res.status(403).json({
            success: false,
            message: 'Vos catégories sont verrouillées et ne peuvent plus être modifiées. Veuillez contacter le support pour toute demande de changement.'
        });
    }

    const { categoriesIds } = req.body;

    if (!Array.isArray(categoriesIds)) {
      return res.status(400).json({
        success: false,
        message: 'Les IDs des catégories doivent être fournis sous forme de tableau'
      });
    }

    // Vérifier que les catégories existent et sont de niveau 1 (grandes familles)
    const categoriesValides = await Categorie.findAll({
      where: {
        id_categorie: { [Op.in]: categoriesIds },
        niveau: 1
      }
    });

    if (categoriesValides.length !== categoriesIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Certaines catégories sont invalides ou ne sont pas des grandes familles'
      });
    }

    // Supprimer les anciennes préférences
    await VendeurCategorie.destroy({
      where: { id_vendeur: vendeurId }
    });

    // Créer les nouvelles préférences
    if (categoriesIds.length > 0) {
      const nouvelles = categoriesIds.map(id => ({
        id_vendeur: vendeurId,
        id_categorie: id
      }));

      await VendeurCategorie.bulkCreate(nouvelles);
    }

    // Verrouiller les catégories pour le vendeur
    vendeur.categories_verrouillees = true;
    await vendeur.save();

    res.json({
      success: true,
      message: 'Préférences catégories mises à jour et verrouillées avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des catégories vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des préférences catégories'
    });
  }
};

// Récupérer toutes les grandes familles pour la configuration
const getAllFamilles = async (req, res) => {
  try {
    const familles = await Categorie.findAll({
      where: { niveau: 1 },
      include: [{
        model: Categorie,
        as: 'sousCategories',
        where: { niveau: 2 },
        required: false
      }],
      order: [['ordre_affichage', 'ASC']]
    });

    res.json({
      success: true,
      data: familles
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des familles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des familles de catégories'
    });
  }
};

module.exports = {
  getVendeurCategories,
  updateVendeurCategories,
  getAllFamilles
};
