const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Paiement = sequelize.define('Paiement', {
    id_paiement: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_paiement'
    },
    montant_paye: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'montant_paye'
    },
    mode_paiement: {
        type: DataTypes.ENUM('carte', 'virement', 'espèces'),
        allowNull: false,
        defaultValue: 'espèces',
        field: 'mode_paiement'
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
    id_facture: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_facture',
        references: {
            model: 'Factures',
            key: 'id_facture'
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
    tableName: 'paiements',
    timestamps: false,
    hooks: {
        beforeUpdate: (paiement) => {
            paiement.updated_at = new Date();
        }
    }
});

module.exports = Paiement;