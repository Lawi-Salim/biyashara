const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Produit = sequelize.define('Produit', {
    id_produit: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_produit'
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nom'
    },
    image: {
        type: DataTypes.STRING(255),
        field: 'image',
        defaultValue: 'default.jpg'
    },
    description: {
        type: DataTypes.TEXT,
        field: 'description'
    },
    prix_unite: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'prix_unite'
    },
    seuil_alerte: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        field: 'seuil_alerte'
    },
    seuil_critique: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        field: 'seuil_critique'
    },
    vues: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'vues'
    },
    ventes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'ventes'
    },
    id_categorie: {
        type: DataTypes.INTEGER,
        field: 'id_categorie',
        references: {
            model: 'Categories',
            key: 'id_categorie'
        },
        onDelete: 'SET NULL'
    },
    id_unite: {
        type: DataTypes.INTEGER,
        field: 'id_unite',
        references: {
            model: 'Unites',
            key: 'id_unite'
        },
        onDelete: 'SET NULL'
    },
    id_vendeur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_vendeur',
        references: {
            model: 'Vendeurs',
            key: 'id_vendeur'
        },
        onDelete: 'CASCADE'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'produits',
    timestamps: false,
    hooks: {
        beforeUpdate: (produit) => {
            produit.updated_at = new Date();
        }
    }
});

module.exports = Produit;