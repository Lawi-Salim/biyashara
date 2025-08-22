const { Boutique, Vendeur, Produit, Stock, Avis, Categorie, Utilisateur, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Créer ou mettre à jour une boutique pour le vendeur connecté
// @route   POST /api/v1/boutiques/my-shop
// @access  Private (Vendeur)
exports.createOrUpdateBoutique = async (req, res) => {
  try {
    const { nom_boutique, description, adresse_boutique } = req.body;
    const id_user = req.user.id_user;

    const vendeur = await Vendeur.findOne({ where: { id_user } });
    if (!vendeur) {
      return res.status(404).json({ message: 'Vendeur non trouvé.' });
    }

    let boutique = await Boutique.findOne({ where: { id_vendeur: vendeur.id_vendeur } });

    const boutiqueData = {
      nom_boutique,
      description,
      adresse_boutique,
      id_vendeur: vendeur.id_vendeur,
    };

    if (req.files && req.files.logo_boutique) {
      // Enregistrer uniquement le public_id (qui est dans `filename`)
      boutiqueData.logo_boutique = req.files.logo_boutique[0].filename;
    }
    // Priorité au fichier téléversé pour la bannière
    if (req.files && req.files.banniere_boutique) {
      boutiqueData.banniere_boutique = req.files.banniere_boutique[0].filename;
    } else if (req.body.banniere_boutique_url) {
      // Sinon, enregistrer le chemin relatif de l'image de la galerie
      try {
        const url = new URL(req.body.banniere_boutique_url);
        boutiqueData.banniere_boutique = url.pathname; // ex: "/banners/banner-1.png"
      } catch (e) {
        console.error('URL de bannière invalide:', req.body.banniere_boutique_url);
      }
    }

    if (boutique) {
      // Mettre à jour la boutique existante
      await boutique.update(boutiqueData);
      return res.status(200).json(boutique);
    } else {
      // Créer une nouvelle boutique
      boutique = await Boutique.create(boutiqueData);
      return res.status(201).json(boutique);
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la création/mise à jour de la boutique.', error: error.message });
  }
};

// @desc    Récupérer les informations de la boutique du vendeur connecté
// @route   GET /api/v1/boutiques/my-shop
// @access  Private (Vendeur)
exports.getMaBoutique = async (req, res) => {
  try {
    const vendeur = await Vendeur.findOne({ where: { id_user: req.user.id_user } });
    if (!vendeur) {
      return res.status(404).json({ message: 'Vendeur non trouvé.' });
    }

    const boutique = await Boutique.findOne({ 
      where: { id_vendeur: vendeur.id_vendeur },
      include: [{
          model: Vendeur,
          as: 'vendeur',
          attributes: ['id_vendeur', 'nom', 'prenom', 'email'],
          include: [
            {
              model: Categorie,
              as: 'categoriesPreferees',
              attributes: ['id_categorie', 'nom'],
              through: { attributes: [] }, // Pour ne pas inclure les attributs de la table de jointure
            },
          ], 
          attributes: ['categories_verrouillees']
      }]
    });
    
    if (!boutique) {
      // S'il n'y a pas de boutique, on renvoie quand même les infos du vendeur
      // pour que le front-end puisse gérer l'état de verrouillage
      return res.status(404).json({ 
        message: 'Aucune boutique trouvée pour ce vendeur.',
        vendeur // On joint quand même les données du vendeur
      });
    }

    res.status(200).json(boutique);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la boutique.', error: error.message });
  }
};

// @desc    Récupérer les informations publiques d'une boutique par slug
// @route   GET /api/v1/boutiques/slug/:slug
// @access  Public
exports.getBoutiqueBySlug = async (req, res) => {
  try {
    const boutique = await Boutique.findOne({ 
      where: { slug: req.params.slug, statut: 'active' }
    });

    if (!boutique) {
      return res.status(404).json({ message: 'Boutique non trouvée.' });
    }

    // Récupérer les produits associés via l'id_vendeur, en s'assurant qu'ils sont en stock
    const produits = await Produit.findAll({
      where: { 
        id_vendeur: boutique.id_vendeur
      },
      include: [{
        model: Stock,
        as: 'stock',
        where: {
          quantite: {
            [Op.gt]: 0 // Op.gt signifie 'greater than' (supérieur à)
          }
        },
        required: true // Ne renvoie que les produits qui ont un stock correspondant
      }]
    });

    // Ajouter les produits à l'objet boutique avant de le renvoyer
    const boutiqueData = boutique.toJSON();
    boutiqueData.produits = produits;

    res.status(200).json(boutiqueData);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// @desc    Lister toutes les boutiques actives
// @route   GET /api/v1/boutiques
// @access  Public
exports.getAllBoutiques = async (req, res) => {
  try {
    const boutiques = await Boutique.findAll({
      where: { statut: 'active' },
      include: [
        {
          model: Vendeur,
          as: 'vendeur',
          attributes: { exclude: ['mot_de_passe'] }, // Exclure les données sensibles
          include: [
            {
              model: Utilisateur,
              as: 'utilisateur',
              attributes: { exclude: ['password'] },
            },
            {
              model: Categorie,
              as: 'categoriesPreferees',
              attributes: ['nom'],
              through: { attributes: [] }, // N'inclut pas la table de jointure
            },
          ],
        },
      ],
    });

    // Enrichir chaque boutique avec les agrégats
    const boutiquesEnrichies = await Promise.all(
      boutiques.map(async (boutique) => {
        const boutiqueJson = boutique.toJSON();

        const product_count = await Produit.count({ where: { id_vendeur: boutique.id_vendeur } });

        const avisStats = await Avis.findOne({
          where: { id_boutique: boutique.id_boutique },
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('id_avis')), 'review_count'],
            [sequelize.fn('AVG', sequelize.col('note')), 'avg_rating'],
          ],
          raw: true,
        });

        // S'assurer qu'il y a toujours une catégorie, même si elle est vide
        if (!boutiqueJson.vendeur.categoriesPreferees || boutiqueJson.vendeur.categoriesPreferees.length === 0) {
          boutiqueJson.vendeur.categoriesPreferees = [{ nom: 'Non spécifié' }];
        }

        return {
          ...boutiqueJson,
          product_count: product_count || 0,
          review_count: avisStats ? parseInt(avisStats.review_count, 10) : 0,
          avg_rating: avisStats && avisStats.avg_rating ? parseFloat(avisStats.avg_rating) : 0,
        };
      })
    );

    res.status(200).json(boutiquesEnrichies);
  } catch (error) {
    console.error('Erreur détaillée dans getAllBoutiques:', error); // Log détaillé pour le débogage
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};
