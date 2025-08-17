const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Livraison = sequelize.define('Livraison', {
    id_livraison: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_livraison'
    },
    adresse: {
        type: DataTypes.TEXT,
        field: 'adresse'
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
    tableName: 'livraisons',
    timestamps: false,
    hooks: {
        beforeUpdate: (livraison) => {
            livraison.updated_at = new Date();
        }
    }
});

module.exports = Livraison;