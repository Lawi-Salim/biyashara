const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const DevenirVendeur = sequelize.define('DevenirVendeur', {
    id_devenirvendeur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_devenirvendeur'
    },
    nom: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'nom'
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'email',
        validate: {
            isEmail: true
        }
    },
    telephone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'telephone'
    },
    nationalite: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nationalite'
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password'
    },
    nom_boutique: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'nom_boutique'
    },
    statut: {
        type: DataTypes.ENUM('en_attente', 'valide', 'rejete'),
        allowNull: false,
        defaultValue: 'en_attente',
        field: 'statut',
        comment: 'Type: statut_demande_enum'
    },
    motif_rejet: {
        type: DataTypes.TEXT,
        field: 'motif_rejet'
    },
    id_user: {
        type: DataTypes.INTEGER,
        field: 'id_user',
        references: {
            model: 'utilisateurs',
            key: 'id_user'
        },
        onDelete: 'SET NULL'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'devenirvendeurs',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['email'],
            name: 'devenirvendeurs_email_key'
        }
    ]
});

module.exports = DevenirVendeur;