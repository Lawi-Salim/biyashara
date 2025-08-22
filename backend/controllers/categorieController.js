const { Categorie, Unite } = require('../models');

// @desc    Récupérer toutes les catégories
// @route   GET /api/v1/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll({
      order: [['nom', 'ASC']]
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// @desc    Récupérer les unités pour une catégorie spécifique
// @route   GET /api/v1/categories/:id/unites
// @access  Public
exports.getUnitesByCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const categorie = await Categorie.findByPk(id, {
      include: [{
        model: Unite,
        as: 'unites',
        through: { attributes: [] } // Ne pas inclure les attributs de la table de liaison
      }]
    });

    if (!categorie) {
      return res.status(404).json({ message: 'Catégorie non trouvée.' });
    }

    res.status(200).json(categorie.unites);
  } catch (error) {
    console.error('Erreur lors de la récupération des unités pour la catégorie :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
