const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur, DevenirVendeur } = require('../models');

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
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

    res.status(201).json({
      message: 'Inscription réussie',
      user: userData,
      token
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'inscription',
      error: error.message 
    });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await Utilisateur.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
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

    res.json({
      message: 'Connexion réussie',
      user: userData,
      token
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la connexion',
      error: error.message 
    });
  }
};

// Récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    // L'utilisateur est déjà attaché à la requête par le middleware d'authentification
    const user = await Utilisateur.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Ne pas renvoyer le mot de passe
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du profil',
      error: error.message 
    });
  }
};

// Mettre à jour le profil de l'utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const { nom, telephone } = req.body;
    const userId = req.user.id;

    const [updated] = await Utilisateur.update(
      { nom, telephone },
      { 
        where: { id_user: userId },
        returning: true,
        individualHooks: true
      }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Récupérer l'utilisateur mis à jour sans le mot de passe
    const updatedUser = await Utilisateur.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message 
    });
  }
};

// Demande pour devenir vendeur
exports.registerSellerRequest = async (req, res) => {
  try {
    const { nom, email, password, telephone, nom_boutique, nationalite } = req.body;

    // Vérifier si une demande ou un utilisateur existe déjà
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Un compte utilisateur existe déjà avec cet email.' });
    }

    const existingRequest = await DevenirVendeur.findOne({ where: { email } });
    if (existingRequest) {
      return res.status(400).json({ message: 'Une demande pour devenir vendeur a déjà été soumise avec cet email.' });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer la demande
    const newRequest = await DevenirVendeur.create({
      nom,
      email,
      password: hashedPassword,
      telephone,
      nom_boutique,
      nationalite: nationalite || 'Non spécifiée',
      statut: 'en_attente'
    });

    res.status(201).json({
      message: 'Votre demande pour devenir vendeur a été soumise avec succès. Vous serez notifié après examen.',
      request: { id: newRequest.id_devenirvendeur, email: newRequest.email }
    });

  } catch (error) {
    console.error('Erreur lors de la soumission de la demande vendeur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la soumission de la demande.',
      error: error.message 
    });
  }
};
