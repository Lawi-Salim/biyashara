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
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'parent_id',
        references: {
            model: 'categories',
            key: 'id_categorie'
        }
    },
    niveau: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'niveau'
    },
    ordre_affichage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'ordre_affichage'
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