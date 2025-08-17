const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const Notification = sequelize.define('Notification', {
    id_notif: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_notif'
    },
    message: {
        type: DataTypes.TEXT,
        field: 'message'
    },
    notif_lu: {
        type: DataTypes.BOOLEAN,
        field: 'notif_lu',
        defaultValue: false
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_user',
        references: {
            model: 'utilisateurs',
            key: 'id_user'
        },
        onDelete: 'CASCADE'
    },
    id_type_notif: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_type_notif',
        references: {
            model: 'typesnotifications',
            key: 'id_type_notif'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'notifications',
    timestamps: false,
    hooks: {
        beforeUpdate: (notification) => {
            notification.updated_at = new Date();
        }
    }
});

module.exports = Notification;
