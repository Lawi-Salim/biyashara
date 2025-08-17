# Biyashara - Plateforme de Marketplace

Plateforme de marché en ligne permettant aux vendeurs de publier leurs produits et aux clients d'effectuer des achats en toute simplicité.

## 🚀 Fonctionnalités

### Espace Vendeurs
- Publication et gestion de produits
- Suivi des commandes
- Tableau de bord de vente
- Gestion de la boutique

### Espace Clients
- Parcours des produits
- Système de recherche avancé
- Panier d'achat
- Suivi des commandes

### Espace Administrateur
- Gestion des utilisateurs
- Supervision des transactions
- Tableau de bord analytique
- Modération des contenus

### Interface Utilisateur (UI)
- **Indicateur de chargement amélioré** : Un spinner de chargement centré et non bloquant s'affiche lors du chargement des données dans les listes (commandes, produits, etc.), offrant une expérience utilisateur plus fluide.

## 🛠️ Stack Technique

### Backend
- Node.js avec Express.js
- Sequelize ORM
- PostgreSQL (local + Supabase en production)
- JWT pour l'authentification

### Frontend
- React
- Redux Toolkit pour la gestion d'état
- React Router pour la navigation
- UI moderne et réactive

## 🚀 Installation

### Prérequis
- Node.js (v16+)
- PostgreSQL (v13+)
- Yarn ou npm

### Configuration

1. **Cloner le dépôt**
   ```bash
   git clone [URL_DU_REPO]
   cd Biyashara
   ```

2. **Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Configurer les variables d'environnement dans .env
   yarn install
   ```

3. **Frontend**
   ```bash
   cd ../frontend
   cp .env.example .env
   yarn install
   ```

## 🗄️ Base de Données

Le schéma de la base de données est défini dans `schema-psql.sql`.

### Création de la base de données locale

1. Se connecter à PostgreSQL
2. Exécuter :
   ```sql
   CREATE DATABASE biyashara;
   \c biyashara
   \i chemin/vers/schema-psql.sql
   ```

## 🗺️ Roadmap de Développement

### Étape 1 : Initialisation des Dashboards (✅ Terminé)
- [x] Création des composants de base pour les dashboards (Admin, Vendeur, Client).
- [x] Mise en place d'un layout commun (`DashboardLayout`).
- [x] Implémentation d'une barre latérale (`Sidebar`) dynamique affichant les menus en fonction du rôle de l'utilisateur.

### Étape 2 : Développement des Fonctionnalités par Rôle (🚧 En cours)

L'objectif de cette étape est de développer les composants correspondant à chaque lien de la barre latérale pour peupler les différents espaces utilisateurs.

#### Espace Administrateur (`/pages/sidebars/sidebarAdmin`)
- **Gestion des Utilisateurs**: Créer un composant pour lister, filtrer et modifier les rôles des utilisateurs.
- **Gestion des Produits**: Créer un composant pour superviser tous les produits publiés sur la plateforme.
- **Gestion des Commandes**: Créer un composant pour visualiser et gérer toutes les transactions.
- **Paramètres**: Développer une page pour les configurations globales de l'application.

#### Espace Vendeur (`/pages/sidebars/sidebarVendeur`)
- **Gestion de "Mes Produits"**: Créer une interface pour que le vendeur puisse ajouter, modifier et supprimer ses propres produits.
- **Gestion de "Mes Ventes"**: Créer un tableau de bord pour que le vendeur puisse suivre l'état de ses ventes et commandes.
- **Paramètres de la Boutique**: Développer une page pour que le vendeur puisse configurer les informations de sa boutique.

#### Espace Client (`/pages/sidebars/sidebarClient`)
- **Gestion de "Mes Commandes"**: Créer une page où le client peut consulter l'historique et le statut de ses commandes.
- **Paramètres du Compte**: Développer un formulaire permettant au client de mettre à jour ses informations personnelles (nom, adresse, etc.).

### Étape 3 : Intégration et Finalisation (⏳ À venir)
- Intégration du backend avec les composants frontend.
- Gestion d'état avancée avec Redux Toolkit.
- Tests et débogage.

## 🔄 Développement

### Démarrer le serveur de développement

**Backend**
```bash
cd backend
yarn dev
```

**Frontend**
```bash
cd frontend
yarn dev
```

## 🚀 Déploiement

### Frontend
Déployé sur Vercel

### Backend
Base de données PostgreSQL hébergée sur Supabase

## 📝 Licence

Ce projet est sous licence MIT.

## 📞 Contact

Pour toute question, veuillez contacter [votre-email@exemple.com](mailto:votre-email@exemple.com)
