const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Commande = sequelize.define('Commande', {
    id_commande: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_commande'
    },
    id_statut: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_statut',
        references: {
            model: 'EtatStatuts',
            key: 'id_statut'
        }
    },
    id_client: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_client',
        references: {
            model: 'Clients',
            key: 'id_client'
        },
        onDelete: 'CASCADE'
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
    tableName: 'commandes',
    timestamps: false,
    hooks: {
        beforeUpdate: (commande) => {
            commande.updated_at = new Date();
        }
    }
});

module.exports = Commande;