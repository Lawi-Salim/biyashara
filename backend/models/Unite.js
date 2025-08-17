const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Unite = sequelize.define('Unite', {
    id_unite: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_unite'
    },
    nom: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'nom'
    },
    symbole: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        field: 'symbole'
    }
}, {
    tableName: 'unites',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['nom'],
            name: 'unites_nom_key'
        },
        {
            unique: true,
            fields: ['symbole'],
            name: 'unites_symbole_key'
        }
    ]
});

module.exports = Unite;