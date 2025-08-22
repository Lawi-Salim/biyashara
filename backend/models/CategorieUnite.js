const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const CategorieUnite = sequelize.define('CategorieUnite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_categorie: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id_categorie'
    }
  },
  id_unite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Unites',
      key: 'id_unite'
    }
  }
}, {
  tableName: 'categorieunites',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // Pas de champ updated_at dans cette table de liaison
});

module.exports = CategorieUnite;
