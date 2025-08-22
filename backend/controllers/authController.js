const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur, DevenirVendeur, Vendeur, Client, Boutique, Notification, TypesNotification } = require('../models');

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

// Mettre à jour le profil de l'utilisateur (nom/telephone/email/mot de passe)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      nom,
      telephone,
      email,
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;

    // Charger l'utilisateur courant
    const existingUser = await Utilisateur.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Si email ou mot de passe changent, exiger le mot de passe actuel
    const wantsSensitiveChange = (email && email !== existingUser.email) || (newPassword && newPassword.length > 0);
    if (wantsSensitiveChange) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Le mot de passe actuel est requis pour modifier l\'email ou le mot de passe.' });
      }
      const isValid = await bcrypt.compare(currentPassword, existingUser.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Mot de passe actuel incorrect.' });
      }
    }

    // Vérifier l'unicité du nouvel email si changé
    if (email && email !== existingUser.email) {
      const emailTaken = await Utilisateur.findOne({ where: { email } });
      if (emailTaken) {
        return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
      }
    }

    // Construire l'objet de mise à jour
    const updateData = {};
    if (typeof nom === 'string') updateData.nom = nom;
    if (typeof telephone === 'string') updateData.telephone = telephone;
    if (email && email !== existingUser.email) updateData.email = email;

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
      }
      if (confirmPassword !== newPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Effectuer la mise à jour
    await Utilisateur.update(updateData, {
      where: { id_user: userId },
      individualHooks: true
    });

    // Renvoyer l'utilisateur mis à jour sans le mot de passe
    const updatedUser = await Utilisateur.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    return res.json({
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message 
    });
  }
};

// Demande pour devenir vendeur
exports.getUserProfile = async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    let profileData = { ...user.toJSON() };

    if (user.role === 'vendeur') {
      const vendeur = await Vendeur.findOne({ where: { id_user: user.id_user } });
      if (vendeur) {
        const boutique = await Boutique.findOne({ where: { id_vendeur: vendeur.id_vendeur } });
        profileData.vendeur = vendeur.toJSON();
        profileData.boutique = boutique ? boutique.toJSON() : null;
      }
    } else if (user.role === 'client') {
      const client = await Client.findOne({ where: { id_user: user.id_user } });
      if (client) {
        profileData.client = client.toJSON();
      }
    } else if (user.role === 'admin') {
      // Pour l'admin, les données de base de l'utilisateur suffisent
      // Aucune donnée supplémentaire à charger pour le moment
      profileData.admin = { /* Ajoutez des détails spécifiques à l'admin si nécessaire */ };
    }

    res.json(profileData);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
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

    // Valider la longueur du mot de passe
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères.' });
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

    // Créer une notification pour les administrateurs
    try {
      console.log('Début de la création de la notification admin...');
      const notifType = await TypesNotification.findOne({ where: { libelle: 'demande_vendeur' } });
      console.log('Type de notification trouvé:', notifType ? notifType.toJSON() : null);

      if (notifType) {
        const admins = await Utilisateur.findAll({ where: { role: 'admin' } });
        console.log(`Nombre d'admins trouvés: ${admins.length}`);

        if (admins.length > 0) {
          const notificationPromises = admins.map(admin => {
            console.log(`Création de la notif pour l'admin ID: ${admin.id_user}`);
            return Notification.create({
              id_user: admin.id_user,
              id_type_notif: notifType.id_type_notif,
              message: `Nouvelle demande vendeur : ${newRequest.nom_boutique}`,
              id_devenirvendeur: newRequest.id_devenirvendeur
            });
          });
          await Promise.all(notificationPromises);
          console.log('Toutes les notifications pour les admins ont été créées.');
        }
      } else {
        console.log('Type de notification "demande_vendeur" non trouvé. Aucune notification ne sera créée.');
      }
    } catch (notifError) {
      console.error('Erreur lors de la création de la notification pour les admins:', notifError);
      // Ne pas bloquer la réponse principale si la notification échoue
    }

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
