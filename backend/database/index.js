const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Sélection de l'environnement
const isProduction = process.env.DATABASE_URL || process.env.VERCEL_URL;
const env = isProduction ? 'production' : 'development';
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
