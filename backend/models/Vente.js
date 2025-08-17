const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Vente = sequelize.define('Vente', {
    id_vente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_vente'
    },
    montant_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'montant_total'
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
        unique: true,
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
    tableName: 'ventes',
    timestamps: false,
    hooks: {
        beforeUpdate: (vente) => {
            vente.updated_at = new Date();
        }
    },
    indexes: [
        {
            unique: true,
            fields: ['id_commande'],
            name: 'ventes_id_commande_key'
        }
    ]
});

module.exports = Vente;