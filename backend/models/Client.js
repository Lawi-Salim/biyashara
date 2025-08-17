const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Client = sequelize.define('Client', {
    id_client: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_client'
    },
    adresse_facturation: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'adresse_facturation'
    },
    solde: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 250000.00,
        field: 'solde'
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_user',
        references: {
            model: 'Utilisateurs',
            key: 'id_user'
        },
        unique: true // Un utilisateur ne peut avoir qu'un seul profil client
    }
}, {
    tableName: 'clients',
    timestamps: false
});

module.exports = Client;