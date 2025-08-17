const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Vendeur = sequelize.define('Vendeur', {
    id_vendeur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_vendeur'
    },
    nationalite: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nationalite'
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_user',
        references: {
            model: 'utilisateurs',
            key: 'id_user'
        }
    },
    statut: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'pending',
        field: 'statut'
    }
}, {
    tableName: 'vendeurs',
    timestamps: false
});

module.exports = Vendeur;