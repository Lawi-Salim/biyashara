const { DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;

const EtatStatut = sequelize.define('EtatStatut', {
    id_statut: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_statut'
    },
    contexte: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'contexte'
    },
    libelle: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'libelle'
    }
}, {
    tableName: 'etatstatuts',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['contexte', 'libelle'],
            name: 'etatstatuts_contexte_libelle_key'
        }
    ]
});

module.exports = EtatStatut;