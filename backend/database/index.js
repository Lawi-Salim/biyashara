const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Sélection de l'environnement (par défaut: development)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialisation de la connexion Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions
  }
);

module.exports = {
  sequelize,
  Sequelize
};
