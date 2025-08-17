const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Utilisateur = sequelize.define('Utilisateurs', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_user'
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nom'
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'email',
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password'
    },
    telephone: {
        type: DataTypes.STRING(20),
        unique: true,
        field: 'telephone'
    },
    role: {
        type: DataTypes.ENUM('admin', 'vendeur', 'client'),
        allowNull: false,
        defaultValue: 'admin',
        field: 'role'
    },
    rappels_actives: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'rappels_actives'
    },
    rappel_horaire: {
        type: DataTypes.ENUM('matin', 'soir', 'nuit'),
        allowNull: false,
        defaultValue: 'soir',
        field: 'rappel_horaire'
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
    tableName: 'utilisateurs',
    timestamps: false,
    hooks: {
        beforeUpdate: (utilisateur) => {
            utilisateur.updated_at = new Date();
        }
    }
});

module.exports = Utilisateur;