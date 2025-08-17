const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const TypesNotification = sequelize.define('TypesNotification', {
    id_type_notif: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_type_notif'
    },
    libelle: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'libelle'
    }
}, {
    tableName: 'typesnotifications',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['libelle'],
            name: 'typesnotifications_libelle_key'
        }
    ]
});

module.exports = TypesNotification;