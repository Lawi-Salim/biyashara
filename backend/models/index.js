const { sequelize } = require('../database');

// Import des modèles
const Utilisateur = require('./Utilisateur');
const Vendeur = require('./Vendeur');
const Client = require('./Client');
const Boutique = require('./Boutique');
const Produit = require('./Produit');
const Categorie = require('./Categorie');
const Commande = require('./Commande');
const DetailCommande = require('./DetailCommande');
const EtatStatut = require('./EtatStatut');
const Vente = require('./Vente');
const Facture = require('./Facture');
const Livraison = require('./Livraison');
const Paiement = require('./Paiement');
const Unite = require('./Unite');
const TypesNotification = require('./TypesNotification');
const Notification = require('./Notification');
const DevenirVendeur = require('./DevenirVendeur');

// Définition des relations

// Un Utilisateur peut être un Vendeur (1:1)
Utilisateur.hasOne(Vendeur, {
    foreignKey: 'id_user',
    as: 'vendeur'
});
Vendeur.belongsTo(Utilisateur, {
    foreignKey: 'id_user',
    as: 'utilisateur'
});

// Un Utilisateur peut être un Client (1:1)
Utilisateur.hasOne(Client, {
    foreignKey: 'id_user',
    as: 'client'
});
Client.belongsTo(Utilisateur, {
    foreignKey: 'id_user',
    as: 'utilisateur'
});

// Synchronisation des modèles avec la base de données (sans forcer la création des tables)
const initModels = async () => {
    try {
        // Vérifier la connexion à la base de données
        await sequelize.authenticate();
        console.log('✅ Connexion à la base de données établie avec succès.');
        
        // Synchroniser les modèles avec la base de données
        // Note: `force: false` pour ne pas recréer les tables existantes
        await sequelize.sync({ force: false });
        console.log('✅ Modèles synchronisés avec la base de données.');
    } catch (error) {
        console.error('❌ Erreur lors de la synchronisation des modèles :', error);
        throw error;
    }
};

// Relation entre Vendeur et Boutique (1:1)
Vendeur.hasOne(Boutique, {
    foreignKey: 'id_vendeur',
    as: 'boutique'
});
Boutique.belongsTo(Vendeur, {
    foreignKey: 'id_vendeur',
    as: 'vendeur'
});

// Relation entre Vendeur et Produit (1:N)
Vendeur.hasMany(Produit, {
    foreignKey: 'id_vendeur',
    as: 'produits'
});
Produit.belongsTo(Vendeur, {
    foreignKey: 'id_vendeur',
    as: 'vendeur'
});

// Relation entre Produit et Categorie (N:1)
Produit.belongsTo(Categorie, {
    foreignKey: 'id_categorie',
    as: 'categorie',
    onDelete: 'SET NULL'
});
Categorie.hasMany(Produit, {
    foreignKey: 'id_categorie',
    as: 'produits'
});

// Relation entre Commande et Client (N:1)
Commande.belongsTo(Client, {
    foreignKey: 'id_client',
    as: 'client'
});
Client.hasMany(Commande, {
    foreignKey: 'id_client',
    as: 'commandes'
});

// Relation entre Commande et Vendeur (N:1)
Commande.belongsTo(Vendeur, {
    foreignKey: 'id_vendeur',
    as: 'vendeur'
});
Vendeur.hasMany(Commande, {
    foreignKey: 'id_vendeur',
    as: 'commandes'
});

// Relation entre DetailCommande et Commande (N:1)
DetailCommande.belongsTo(Commande, {
    foreignKey: 'id_commande',
    as: 'commande'
});
Commande.hasMany(DetailCommande, {
    foreignKey: 'id_commande',
    as: 'details'
});

// Relation entre DetailCommande et Produit (N:1)
DetailCommande.belongsTo(Produit, {
    foreignKey: 'id_produit',
    as: 'produit'
});
Produit.hasMany(DetailCommande, {
    foreignKey: 'id_produit',
    as: 'details_commandes'
});

// Relation entre Commande et EtatStatut
Commande.belongsTo(EtatStatut, {
    foreignKey: 'id_statut',
    as: 'statut'
});

// Relation entre Vente et EtatStatut
Vente.belongsTo(EtatStatut, {
    foreignKey: 'id_statut',
    as: 'statut'
});

// Relation entre Vente et Commande
Vente.belongsTo(Commande, {
    foreignKey: 'id_commande',
    as: 'commande'
});

// Relation entre Facture et EtatStatut
Facture.belongsTo(EtatStatut, {
    foreignKey: 'id_statut',
    as: 'statut'
});

// Relation entre Facture et Vente
Facture.belongsTo(Vente, {
    foreignKey: 'id_vente',
    as: 'vente'
});

// Relation entre Livraison et EtatStatut
Livraison.belongsTo(EtatStatut, {
    foreignKey: 'id_statut',
    as: 'statut'
});

// Relation entre Livraison et Commande
Livraison.belongsTo(Commande, {
    foreignKey: 'id_commande',
    as: 'commande'
});

// Relation entre Paiement et EtatStatut
Paiement.belongsTo(EtatStatut, {
    foreignKey: 'id_statut',
    as: 'statut'
});

// Relation entre Paiement et Facture
Paiement.belongsTo(Facture, {
    foreignKey: 'id_facture',
    as: 'facture'
});

// Relation entre Produit et Unite
Produit.belongsTo(Unite, {
    foreignKey: 'id_unite',
    as: 'unite',
    onDelete: 'SET NULL'
});

// Relation entre Notification et Utilisateur
Notification.belongsTo(Utilisateur, {
    foreignKey: 'id_user',
    as: 'utilisateur',
    onDelete: 'CASCADE'
});

// Relation entre Notification et TypesNotification
Notification.belongsTo(TypesNotification, {
    foreignKey: 'id_type_notif',
    as: 'type_notification'
});

// Relation entre DevenirVendeur et Utilisateur (optionnelle)
DevenirVendeur.belongsTo(Utilisateur, {
    foreignKey: 'id_user',
    as: 'utilisateur',
    onDelete: 'SET NULL'
});

// Exporter les modèles et la fonction d'initialisation
module.exports = {
    sequelize,
    initModels,
    // Modèles principaux
    Utilisateur,
    Vendeur,
    Client,
    // Gestion des produits
    Boutique,
    Produit,
    Categorie,
    Unite,
    // Gestion des commandes
    Commande,
    DetailCommande,
    Vente,
    // Gestion des factures et paiements
    Facture,
    Paiement,
    // Gestion des livraisons
    Livraison,
    // Gestion des notifications
    Notification,
    TypesNotification,
    // Gestion des demandes de vendeur
    DevenirVendeur,
    // Référentiel
    EtatStatut
};