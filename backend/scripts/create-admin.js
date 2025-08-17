console.log('--- EXECUTING CREATE-ADMIN SCRIPT ---');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { sequelize } = require('../database');
const Utilisateur = require('../models/Utilisateur');

const ADMIN_EMAIL = 'wahilamwamtsa@gmail.com';
const ADMIN_NAME = 'Lawi Salim';
const ADMIN_PASSWORD = '123456';

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    const existingAdmin = await Utilisateur.findOne({ where: { email: ADMIN_EMAIL } });

    if (existingAdmin) {
      console.log('L\'utilisateur administrateur existe déjà.');
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const newAdmin = await Utilisateur.create({
      nom: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Utilisateur administrateur créé avec succès:', newAdmin.toJSON());

  } catch (error) {
    console.error('Impossible de créer l\'utilisateur administrateur:', error);
  } finally {
    await sequelize.close();
    console.log('Connexion à la base de données fermée.');
  }
};

createAdmin();
