const { Sequelize } = require('sequelize');
// Import explicite pour forcer l'inclusion du dialecte Postgres sur Vercel
require('pg');
require('pg-hstore');
const config = require('../config/database');

// Si DATABASE_URL est défini (production Vercel + Supabase), on l'utilise directement
let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // Sinon, fallback sur la configuration en fonction de l'environnement
  const env = process.env.NODE_ENV || 'development';
  const dbConfig = config[env];

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
}

module.exports = {
  sequelize,
  Sequelize
};
