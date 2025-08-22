const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database');

class SupportTicket extends Model {}

SupportTicket.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_support_ticket'
  },
  vendeur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Vendeurs',
      key: 'id_vendeur',
    },
  },
  raison: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('ouvert', 'accepté', 'refusé'),
    allowNull: false,
    defaultValue: 'ouvert',
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Utilisateurs',
      key: 'id_user',
    },
  },
}, {
  sequelize,
  tableName: 'supporttickets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = SupportTicket;
