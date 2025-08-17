console.log('--- VERCEL LOG: API index.js execution started ---');

// Import des dépendances
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check } = require('express-validator');

// Import de la base de données et des modèles
const { sequelize } = require('../backend/database');
const { Utilisateur } = require('../backend/models');

console.log('--- VERCEL LOG: Dependencies imported ---');

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

// Variable pour s'assurer que l'admin n'est créé qu'une seule fois
let adminCreationAttempted = false;

// Fonction pour créer l'admin par défaut
const createDefaultAdmin = async () => {
  if (adminCreationAttempted) {
    console.log('--- VERCEL LOG: Admin creation already attempted ---');
    return;
  }
  adminCreationAttempted = true;

  try {
    console.log('--- VERCEL LOG: Starting admin creation process ---');
    
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

// Route de test
app.get('/', (req, res) => {
  console.log('--- VERCEL LOG: Root route accessed ---');
  res.json({ message: 'Bienvenue sur l\'API Biyashara' });
});

// Route de connexion
app.post('/api/auth/login', [
  check('email', 'Veuillez fournir un email valide').isEmail(),
  check('password', 'Le mot de passe est requis').exists()
], async (req, res) => {
  try {
    console.log('--- VERCEL LOG: Login attempt for email:', req.body.email);
    
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await Utilisateur.findOne({ where: { email } });
    if (!user) {
      console.log('--- VERCEL LOG: User not found for email:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('--- VERCEL LOG: Invalid password for email:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { user: { id: user.id_user, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '90d' }
    );

    // Ne pas renvoyer le mot de passe dans la réponse
    const userData = user.get({ plain: true });
    delete userData.password;

    console.log('--- VERCEL LOG: Login successful for user:', userData.email);

    res.json({
      message: 'Connexion réussie',
      user: userData,
      token
    });

  } catch (error) {
    console.error('--- VERCEL LOG: Login error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la connexion',
      error: error.message 
    });
  }
});

// Route d'inscription
app.post('/api/auth/register', [
  check('nom', 'Le nom est requis').not().isEmpty(),
  check('email', 'Veuillez fournir un email valide').isEmail(),
  check('password', 'Veuillez entrer un mot de passe de 6 caractères ou plus').isLength({ min: 6 })
], async (req, res) => {
  try {
    console.log('--- VERCEL LOG: Registration attempt for email:', req.body.email);
    
    const { nom, email, password, telephone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = await Utilisateur.create({
      nom,
      email,
      password: hashedPassword,
      telephone: telephone || null,
      role: 'client' // Rôle par défaut
    });

    // Créer le token JWT
    const token = jwt.sign(
      { user: { id: user.id_user, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '90d' }
    );

    // Ne pas renvoyer le mot de passe dans la réponse
    const userData = user.get({ plain: true });
    delete userData.password;

    console.log('--- VERCEL LOG: Registration successful for user:', userData.email);

    res.status(201).json({
      message: 'Inscription réussie',
      user: userData,
      token
    });

  } catch (error) {
    console.error('--- VERCEL LOG: Registration error:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'inscription',
      error: error.message 
    });
  }
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

console.log('--- VERCEL LOG: Routes configured ---');

// Créer l'admin par défaut au démarrage
createDefaultAdmin();

console.log('--- VERCEL LOG: API index.js module exported ---');

module.exports = app;
