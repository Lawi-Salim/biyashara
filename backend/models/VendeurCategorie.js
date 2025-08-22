const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const VendeurCategorie = sequelize.define('VendeurCategorie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    id_vendeur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_vendeur',
        references: {
            model: 'vendeurs',
            key: 'id_vendeur'
        }
    },
    id_categorie: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_categorie',
        references: {
            model: 'categories',
            key: 'id_categorie'
        }
    }
}, {
    tableName: 'vendeurcategories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    name: {
        singular: 'vendeurcategorie',
        plural: 'vendeurcategories'
    },
    indexes: [
        {
            unique: true,
            fields: ['id_vendeur', 'id_categorie']
        }
    ]
});

module.exports = VendeurCategorie;
