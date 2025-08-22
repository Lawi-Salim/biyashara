const models = require('../models');
const { Produit, Stock, Vendeur, Utilisateur, Boutique, sequelize } = models;
const cloudinary = require('cloudinary').v2;
const { validationResult } = require('express-validator');

// @desc    Créer un nouveau produit
// @route   POST /api/v1/produits
// @access  Private (Vendeur)
const createProduit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const t = await sequelize.transaction();

  try {
    const { nom, description, prix_unite, id_categorie, id_unite, quantite_stock } = req.body;

    // Récupérer l'ID du vendeur depuis la table vendeurs basé sur l'utilisateur connecté
    const vendeur = await Vendeur.findOne({ where: { id_user: req.user.id_user } });
    if (!vendeur) {
      return res.status(403).json({ message: 'Utilisateur non autorisé à créer des produits.' });
    }
    const id_vendeur = vendeur.id_vendeur;

    // Récupérer la boutique du vendeur
    const boutique = await Boutique.findOne({ where: { id_vendeur } });
    if (!boutique) {
      await t.rollback();
      return res.status(400).json({ message: "Vous devez d'abord créer une boutique avant d'ajouter des produits." });
    }

    // Vérifier si un fichier a été uploadé
    if (!req.file) {
        return res.status(400).json({ message: 'Veuillez télécharger une image pour le produit.' });
    }

    const nouveauProduit = await Produit.create({
      nom,
      description,
      prix_unite,
      id_categorie,
      id_unite,
      id_vendeur,
      image: req.file.path // Enregistrer l'URL complète de Cloudinary
    }, { transaction: t });

    // Créer l'entrée de stock initiale pour le nouveau produit
    await Stock.create({ 
      id_produit: nouveauProduit.id_produit,
      quantite: quantite_stock || 0
    }, { transaction: t });

    // Valider la transaction
    await t.commit();

    res.status(201).json(nouveauProduit);
  } catch (error) {
    // Annuler la transaction en cas d'erreur
    await t.rollback();
    console.error('--- Erreur détaillée lors de la création du produit ---', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du produit.' });
  }
};

// @desc    Récupérer les produits du vendeur connecté
// @route   GET /api/v1/produits/vendeur
// @access  Private (Vendeur)
const getVendeurProduits = async (req, res) => {
  try {
    // Récupérer l'ID du vendeur depuis la table vendeurs
    const vendeur = await Vendeur.findOne({ where: { id_user: req.user.id_user } });
    if (!vendeur) {
      return res.status(403).json({ message: 'Utilisateur non autorisé.' });
    }
    const id_vendeur = vendeur.id_vendeur;
    const produits = await Produit.findAll({
      where: { id_vendeur },
      attributes: {
        exclude: ['id_boutique']
      },
      include: [{
        model: Stock,
        as: 'stock',
        attributes: ['id_stock', 'quantite']
      }],
      order: [['created_at', 'DESC']]
    });

    const produitsAvecUrl = produits.map(p => {
      const produitJson = p.toJSON();
      if (produitJson.image && !produitJson.image.startsWith('http')) {
        produitJson.image = cloudinary.url(produitJson.image);
      }
      return produitJson;
    });

    res.status(200).json(produitsAvecUrl);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits du vendeur :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// @desc    Mettre à jour un produit
// @route   PUT /api/v1/produits/:id
// @access  Private (Vendeur)
const updateProduit = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nom, description, prix_unite, quantite_stock } = req.body;
    
    // Récupérer l'ID du vendeur depuis la table vendeurs
    const vendeur = await Vendeur.findOne({ where: { id_user: req.user.id_user } });
    if (!vendeur) {
      return res.status(403).json({ message: 'Utilisateur non autorisé.' });
    }
    const id_vendeur = vendeur.id_vendeur;

    const produit = await Produit.findOne({ 
      where: { id_produit: id, id_vendeur },
      transaction: t 
    });

    if (!produit) {
      await t.rollback();
      return res.status(404).json({ message: 'Produit non trouvé ou non autorisé.' });
    }

    // Mettre à jour les champs du produit
    produit.nom = nom || produit.nom;
    produit.description = description || produit.description;
    produit.prix_unite = prix_unite || produit.prix_unite;
    await produit.save({ transaction: t });

    // Mettre à jour le stock
    const [stock, created] = await Stock.findOrCreate({
      where: { id_produit: produit.id_produit },
      defaults: { quantite: quantite_stock || 0 },
      transaction: t
    });

    if (!created) {
      stock.quantite = quantite_stock || stock.quantite;
      await stock.save({ transaction: t });
    }

    await t.commit();

    // Récupérer le produit mis à jour avec son stock pour la réponse
    const produitMisAJour = await Produit.findByPk(id, {
      include: [{ model: Stock, as: 'stock', attributes: ['quantite'] }]
    });

    res.status(200).json(produitMisAJour);

  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de la mise à jour du produit :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
  }
};

// @desc    Récupérer tous les produits (pour l'admin)
// @route   GET /api/v1/produits/admin/all
// @access  Private (Admin)
const getAllProduits = async (req, res) => {
  try {
    const produits = await Produit.findAll({
      attributes: { exclude: ['id_boutique'] },
      include: [
        {
          model: Stock,
          as: 'stock',
          attributes: ['quantite']
        },
        {
          model: Vendeur, // Assurez-vous que le modèle Vendeur est importé
          as: 'vendeur',
          include: [{
            model: Utilisateur, // Assurez-vous que le modèle Utilisateur est importé
            as: 'utilisateur',
            attributes: ['nom']
          }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const produitsAvecUrl = produits.map(p => {
      const produitJson = p.toJSON();
      if (produitJson.image && !produitJson.image.startsWith('http')) {
        produitJson.image = cloudinary.url(produitJson.image);
      }
      // Simplifier la structure de l'objet vendeur
      if (produitJson.vendeur && produitJson.vendeur.utilisateur) {
        produitJson.nom_vendeur = produitJson.vendeur.utilisateur.nom;
      } else {
        produitJson.nom_vendeur = 'N/A';
      }
      delete produitJson.vendeur; // Nettoyer l'objet

      return produitJson;
    });

    res.status(200).json(produitsAvecUrl);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les produits :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


module.exports = {
  createProduit,
  getVendeurProduits,
  updateProduit,
  getAllProduits,
};
