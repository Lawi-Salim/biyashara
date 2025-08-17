const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Categorie = sequelize.define('Categorie', {
    id_categorie: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_categorie'
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nom',
        unique: true
    }
}, {
    tableName: 'categories',
    timestamps: false, // Désactive les timestamps automatiques
    name: {
      singular: 'categorie',
      plural: 'categories'
    },
    hooks: {
        beforeUpdate: (categorie) => {
            categorie.updated_at = new Date();
        }
    }
});

module.exports = Categorie;