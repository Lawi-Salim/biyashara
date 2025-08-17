const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Boutique = sequelize.define('Boutiques', {
    id_boutique: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_boutique'
    },
    nom_boutique: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nom_boutique'
    },
    description: {
        type: DataTypes.TEXT,
        field: 'description'
    },
    adresse_boutique: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'adresse_boutique'
    },
    logo_boutique: {
        type: DataTypes.STRING(255),
        field: 'logo_boutique'
    },
    banniere_boutique: {
        type: DataTypes.STRING(255),
        field: 'banniere_boutique'
    },
    id_vendeur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_vendeur',
        references: {
            model: 'Vendeurs',
            key: 'id_vendeur'
        }
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
    tableName: 'boutiques',
    timestamps: false,

    hooks: {
        beforeUpdate: (boutique) => {
            boutique.updated_at = new Date();
        }
    }
})

module.exports = Boutique;