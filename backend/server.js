console.log('--- VERCEL LOG: Backend server.js execution started ---');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importation des routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Variable pour s'assurer que l'admin n'est créé qu'une seule fois par session
let adminCreationAttempted = false;

// Fonction pour créer l'admin par défaut (une seule fois par session)
const createDefaultAdmin = async () => {
  // Éviter les appels multiples
  if (adminCreationAttempted) {
    return;
  }
  adminCreationAttempted = true;

  try {
    const bcrypt = require('bcryptjs');
    const { Utilisateur } = require('./models');
    
    const ADMIN_EMAIL = 'wahilamwamtsa@gmail.com';
    const ADMIN_NAME = 'Lawi Salim';
    const ADMIN_PASSWORD = '123456';

    // Vérifier si l'admin existe déjà
    const existingAdmin = await Utilisateur.findOne({ where: { email: ADMIN_EMAIL } });

    if (existingAdmin) {
      console.log('✅ L\'utilisateur administrateur existe déjà.');
      return;
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Créer l'admin
    const newAdmin = await Utilisateur.create({
      nom: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Utilisateur administrateur créé avec succès:', {
      id: newAdmin.id_user,
      nom: newAdmin.nom,
      email: newAdmin.email,
      role: newAdmin.role
    });

  } catch (error) {
    console.error('❌ Impossible de créer l\'utilisateur administrateur:', error);
  }
};

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Biyashara' });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  const error = new Error('Ressource non trouvée');
  error.status = 404;
  next(error);
});

// Gestionnaire d'erreurs global
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// Configuration du port
const PORT = process.env.PORT || 5000;

// Démarrage du serveur uniquement si ce n'est pas en production (Vercel s'en occupe)
if (process.env.NODE_ENV !== 'production') {
  const startTime = Date.now();

  app.listen(PORT, async () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const minutes = Math.floor(duration / 60000);
      const seconds = ((duration % 60000) / 1000).toFixed(0);
      const formattedTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      const now = new Date();
      const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      console.log(`✅ Serveur prêt et fonctionnel sur le port ${PORT}`);
      console.log(`🚀 Démarrage en ${formattedTime} | En cours à ${timeString}`);
      console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
      
      // Créer l'admin par défaut au démarrage (une seule fois)
      await createDefaultAdmin();
    });
} else {
  // En production (Vercel), créer l'admin par défaut (une seule fois)
  createDefaultAdmin();
}

module.exports = app;