require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importation des routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

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

  app.listen(PORT, () => {
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
    });
}

module.exports = app;