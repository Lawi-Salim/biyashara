const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Avis = sequelize.define('Avis', {
    id_avis: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    note: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    commentaire: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Utilisateurs',
            key: 'id_user'
        }
    },
    id_boutique: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Boutiques',
            key: 'id_boutique'
        }
    }
}, {
    tableName: 'avis',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Avis;
