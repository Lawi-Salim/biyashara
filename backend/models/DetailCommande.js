const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const DetailCommande = sequelize.define('DetailCommande', {
    id_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_detail'
    },
    quantite: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'quantite'
    },
    prix_unitaire: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'prix_unitaire'
    },
    id_commande: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_commande',
        references: {
            model: 'Commandes',
            key: 'id_commande'
        },
        onDelete: 'CASCADE'
    },
    id_produit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_produit',
        references: {
            model: 'Produits',
            key: 'id_produit'
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
    tableName: 'detailcommandes',
    timestamps: false,
    hooks: {
        beforeUpdate: (detail) => {
            detail.updated_at = new Date();
        }
    }
});

module.exports = DetailCommande;