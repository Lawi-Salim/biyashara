console.log('--- VERCEL LOG: Backend server.js execution started ---');
console.log('--- VERCEL LOG: Node version:', process.version);
console.log('--- VERCEL LOG: Environment:', process.env.NODE_ENV);
console.log('--- VERCEL LOG: Current directory:', __dirname);

require('dotenv').config();

console.log('--- VERCEL LOG: Dotenv loaded ---');
console.log('--- VERCEL LOG: DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('--- VERCEL LOG: JWT_SECRET exists:', !!process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

console.log('--- VERCEL LOG: Express and middleware imported ---');

// Importation des routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

console.log('--- VERCEL LOG: Routes imported ---');

// Variable pour s'assurer que l'admin n'est créé qu'une seule fois par session
let adminCreationAttempted = false;

// Fonction pour créer l'admin par défaut (une seule fois par session)
const createDefaultAdmin = async () => {
  // Éviter les appels multiples
  if (adminCreationAttempted) {
    console.log('--- VERCEL LOG: Admin creation already attempted ---');
    return;
  }
  adminCreationAttempted = true;

  try {
    console.log('--- VERCEL LOG: Starting admin creation process ---');
    const bcrypt = require('bcryptjs');
    const { Utilisateur } = require('./models');
    
    const ADMIN_EMAIL = 'wahilamwamtsa@gmail.com';
    const ADMIN_NAME = 'Lawi Salim';
    const ADMIN_PASSWORD = '123456';

    console.log('--- VERCEL LOG: Checking if admin exists ---');
    // Vérifier si l'admin existe déjà
    const existingAdmin = await Utilisateur.findOne({ where: { email: ADMIN_EMAIL } });

    if (existingAdmin) {
      console.log('✅ L\'utilisateur administrateur existe déjà.');
      return;
    }

    console.log('--- VERCEL LOG: Creating new admin user ---');
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

console.log('--- VERCEL LOG: Express app initialized ---');

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('--- VERCEL LOG: Middleware configured ---');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

console.log('--- VERCEL LOG: Routes configured ---');

// Route de test
app.get('/', (req, res) => {
  console.log('--- VERCEL LOG: Root route accessed ---');
  res.json({ message: 'Bienvenue sur l\'API Biyashara' });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  console.log('--- VERCEL LOG: 404 error for route:', req.path);
  const error = new Error('Ressource non trouvée');
  error.status = 404;
  next(error);
});

// Gestionnaire d'erreurs global
app.use((error, req, res, next) => {
  console.log('--- VERCEL LOG: Global error handler:', error.message);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// Configuration du port
const PORT = process.env.PORT || 5000;

console.log('--- VERCEL LOG: Environment:', process.env.NODE_ENV);

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
  console.log('--- VERCEL LOG: Production environment detected, creating admin ---');
  // En production (Vercel), créer l'admin par défaut (une seule fois)
  createDefaultAdmin();
}

console.log('--- VERCEL LOG: Server.js module exported ---');

module.exports = app;