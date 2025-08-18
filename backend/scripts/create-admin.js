console.log('--- EXECUTING CREATE-ADMIN SCRIPT ---');

const isProduction = process.env.DATABASE_URL || process.env.VERCEL_URL;

// Charger le fichier .env seulement en développement
if (!isProduction) {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
  console.log('Script create-admin ignoré en développement. Il ne s\'exécute qu\'en production.');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('VERCEL_URL exists:', !!process.env.VERCEL_URL);
  process.exit(0);
}

// En production, utiliser directement les variables d'environnement de Vercel
console.log('Mode production détecté - utilisation des variables d\'environnement Vercel');

// Forcer l'environnement de production
process.env.NODE_ENV = 'production';

const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
const Utilisateur = require('../models/Utilisateur');

const ADMIN_EMAIL = 'wahilamwamtsa@gmail.com';
const ADMIN_NAME = 'Lawi Salim';
const ADMIN_PASSWORD = '123456';

const createAdmin = async () => {
  let sequelize;
  
  try {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('VERCEL_URL exists:', !!process.env.VERCEL_URL);
    
    // Configuration de la connexion Sequelize pour la production
    const dbConfig = {
      username: process.env.DB_USER_PROD,
      password: process.env.DB_PASSWORD_PROD,
      database: process.env.DB_NAME_PROD,
      host: process.env.DB_HOST_PROD,
      port: process.env.DB_PORT_PROD,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      native: false,
      logging: false,
      pool: {
        max: 1,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    };

    console.log('Tentative de connexion avec la configuration:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.username,
      database: dbConfig.database,
      password_exists: !!dbConfig.password
    });

    sequelize = new Sequelize(
      dbConfig.database, 
      dbConfig.username, 
      dbConfig.password, 
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        dialectOptions: dbConfig.dialectOptions,
        native: dbConfig.native,
        logging: dbConfig.logging,
        pool: dbConfig.pool
      }
    );
    
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès via Session Pooler.');

    const existingAdmin = await Utilisateur.findOne({ where: { email: ADMIN_EMAIL } });

    if (existingAdmin) {
      console.log('L\'utilisateur administrateur existe déjà. Création ignorée.');
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const newAdmin = await Utilisateur.create({
      nom: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Utilisateur administrateur créé avec succès en production:', newAdmin.toJSON());

  } catch (error) {
    console.error('❌ Impossible de créer l\'utilisateur administrateur:', error);
  } finally {
    if (sequelize) {
      await sequelize.close();
      console.log('Connexion à la base de données fermée.');
    }
  }
};

createAdmin();
