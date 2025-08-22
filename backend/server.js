require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Importation des routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notification');
const produitRoutes = require('./routes/produitRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const uniteRoutes = require('./routes/uniteRoutes');
const boutiqueRoutes = require('./routes/boutiqueRoutes');
const vendeurCategoriesRoutes = require('./routes/vendeurCategories');
const supportRoutes = require('./routes/support');
const adminSupportRoutes = require('./routes/adminSupport');

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (logos, bannières, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Log minimal de chaque requête pour debug serverless
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes (supporte avec ou sans préfixe "/api" selon le routage Vercel)
app.use('/api/v1/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/admin', adminRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/notifications', notificationRoutes);
app.use('/api/v1/produits', produitRoutes);
app.use('/produits', produitRoutes);
app.use('/api/v1/categories', categorieRoutes);
app.use('/categories', categorieRoutes);
app.use('/api/v1/unites', uniteRoutes);
app.use('/unites', uniteRoutes);
app.use('/api/v1/boutiques', boutiqueRoutes);
app.use('/boutiques', boutiqueRoutes);
app.use('/api/v1/vendeur-categories', vendeurCategoriesRoutes);
app.use('/vendeur-categories', vendeurCategoriesRoutes);

// Routes pour le support
app.use('/api/v1/support', supportRoutes);
app.use('/support', supportRoutes);
app.use('/api/v1/admin/support', adminSupportRoutes);
app.use('/admin/support', adminSupportRoutes);

// Endpoint de santé pour diagnostic
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

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

// Démarrage du serveur uniquement en local (pas sur Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    const startTime = Date.now();
    const endTime = Date.now();
    const duration = endTime - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    const formattedTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    console.log(`[${timeString}] Serveur démarré sur le port ${PORT} en ${formattedTime}`);
  });
}

// Exporter l'application pour Vercel
module.exports = app;