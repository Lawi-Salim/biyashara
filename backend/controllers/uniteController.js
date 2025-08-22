const { Unite, Categorie } = require('../models');

// @desc    Récupérer toutes les unités
// @route   GET /api/v1/unites
// @access  Public
exports.getUnitesByCategories = async (req, res) => {
  try {
    const { categorieIds } = req.body;

    if (!categorieIds || !Array.isArray(categorieIds) || categorieIds.length === 0) {
      return res.status(400).json({ message: 'Une liste d\'IDs de catégories est requise.' });
    }

    const unites = await Unite.findAll({
      include: [{
        model: Categorie,
        as: 'categories',
        where: { id_categorie: categorieIds },
        attributes: [], // Ne pas inclure les attributs de la catégorie
        through: { attributes: [] } // Ne pas inclure les attributs de la table de liaison
      }],
      order: [['nom', 'ASC']],
      group: ['Unite.id_unite', 'Unite.nom', 'Unite.symbole'],
    });

    res.status(200).json(unites);
  } catch (error) {
    console.error('Erreur lors de la récupération des unités par catégories :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getAllUnites = async (req, res) => {
  try {
    const unites = await Unite.findAll({
        order: [['nom', 'ASC']]
    });
    res.status(200).json(unites);
  } catch (error) {
    console.error('Erreur lors de la récupération des unités :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
