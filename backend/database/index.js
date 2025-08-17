const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Sélection de l'environnement (par défaut: development)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialisation de la connexion Sequelize
let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

module.exports = {
  sequelize,
  Sequelize
};
