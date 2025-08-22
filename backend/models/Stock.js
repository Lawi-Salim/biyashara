const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Stock = sequelize.define('Stock', {
    id_stock: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_stock'
    },
    quantite: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'quantite'
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
    tableName: 'stocks',
    timestamps: false,
    hooks: {
        beforeUpdate: (stock) => {
            stock.updated_at = new Date();
        }
    }
});

module.exports = Stock;
