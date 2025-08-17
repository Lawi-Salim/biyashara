const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Facture = sequelize.define('Facture', {
    id_facture: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_facture'
    },
    numero_facture: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'numero_facture',
        unique: true
    },
    montant: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'montant'
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
    id_vente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_vente',
        references: {
            model: 'Ventes',
            key: 'id_vente'
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
    tableName: 'factures',
    timestamps: false,
    hooks: {
        beforeUpdate: (facture) => {
            facture.updated_at = new Date();
        }
    },
    indexes: [
        {
            unique: true,
            fields: ['numero_facture'],
            name: 'factures_numero_facture_key'
        }
    ]
});

module.exports = Facture;