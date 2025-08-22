# 🗺️ Roadmap de Développement

### Étape 1 : Initialisation des Dashboards (✅ Terminé)
- [x] Création des composants de base pour les dashboards (Admin, Vendeur, Client).
- [x] Mise en place d'un layout commun (`DashboardLayout`).
- [x] Implémentation d'une barre latérale (`Sidebar`) dynamique affichant les menus en fonction du rôle de l'utilisateur.

### Étape 2 : Développement des Fonctionnalités par Rôle (✅ Terminé - 17/08/2025)

L'objectif de cette étape est de développer les composants correspondant à chaque lien de la barre latérale pour peupler les différents espaces utilisateurs.

#### Espace Administrateur (`/pages/sidebars/sidebarAdmin`)
- [x] **Gestion des Produits**: Superviser tous les produits publiés sur la plateforme.
- [ ] **Gestion des Utilisateurs**: Lister, filtrer et modifier les rôles des utilisateurs.
- [ ] **Gestion des Demandes Vendeurs**: Accepter ou refuser les demandes pour devenir vendeur.
- [ ] **Gestion des Commandes**: Visualiser et gérer toutes les transactions.
- [ ] **Paramètres**: Développer une page pour les configurations globales de l'application.

#### Espace Vendeur (`/pages/sidebars/sidebarVendeur`)
- [x] **Gestion de "Mes Produits"**: Interface pour ajouter, modifier et supprimer ses propres produits.
- [ ] **Gestion de "Mes Ventes"**: Tableau de bord pour suivre l'état des ventes et commandes.
- [ ] **Paramètres de la Boutique**: Page pour configurer les informations de la boutique.

#### Espace Client (`/pages/sidebars/sidebarClient`)
- [ ] **Gestion de "Mes Commandes"**: Consulter l'historique et le statut des commandes.
- [ ] **Paramètres du Compte**: Mettre à jour les informations personnelles.

### Étape 3 : Fonctionnalités Transversales (✅ Terminé - 19/08/2025)
- [x] **Processus "Devenir Vendeur"**: Permettre aux utilisateurs de soumettre une demande pour devenir vendeur.
- [x] **Système de Notifications**: Notifications pour les actions clés (demande vendeur acceptée/refusée, etc.).

### Étape 4 : Gestion de la Boutique (🚀 À Démarrer - 20/08/2025)
- **Backend**:
  - [x] **Modèle `Boutique.js`**: Finaliser les champs (nom, description, logo, bannière, slug, statut).
  - [ ] **Contrôleur `boutiqueController.js`**: Logique de création, mise à jour et récupération des informations.
  - [ ] **Routes `boutiqueRoutes.js`**: Définir les endpoints de l'API pour la gestion de la boutique.
- **Frontend**:
  - [ ] **Espace Vendeur**: Créer une page de configuration de la boutique.
  - [ ] **Vue Publique**: Développer une page listant toutes les boutiques pour les visiteurs.
  - [ ] **Détail Boutique**: Créer une page de profil affichant les détails d'une boutique et ses produits.

### Étape 5 : Intégration et Finalisation (⏳ À venir)
- Intégration complète du backend avec les composants frontend.
- Gestion d'état avancée avec Redux Toolkit.
- Tests et débogage.