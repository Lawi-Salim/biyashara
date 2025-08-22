const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Boutique = sequelize.define('Boutique', {
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
    slug: {
        type: DataTypes.STRING(150),
        unique: true,
        allowNull: false,
        field: 'slug'
    },
    statut: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false,
        field: 'statut'
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
        beforeCreate: (boutique) => {
            boutique.slug = boutique.nom_boutique.toString().toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        },
        beforeUpdate: (boutique) => {
            if (boutique.changed('nom_boutique')) {
                boutique.slug = boutique.nom_boutique.toString().toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '');
            }
            boutique.updated_at = new Date();
        }
    }
})

module.exports = Boutique;