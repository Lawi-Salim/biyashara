-- =============================
-- Nettoyage initial de la base
-- =============================

-- Suppression des tables (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS Paiements CASCADE;
DROP TABLE IF EXISTS Livraisons CASCADE;
DROP TABLE IF EXISTS Factures CASCADE;
DROP TABLE IF EXISTS Ventes CASCADE;
DROP TABLE IF EXISTS DetailCommandes CASCADE;
DROP TABLE IF EXISTS Commandes CASCADE;
DROP TABLE IF EXISTS Stocks CASCADE;
DROP TABLE IF EXISTS Produits CASCADE;
DROP TABLE IF EXISTS Boutiques CASCADE;
DROP TABLE IF EXISTS VendeurCategories CASCADE;
DROP TABLE IF EXISTS CategorieUnites CASCADE;
DROP TABLE IF EXISTS Clients CASCADE;
DROP TABLE IF EXISTS Vendeurs CASCADE;
DROP TABLE IF EXISTS Notifications CASCADE;
DROP TABLE IF EXISTS DevenirVendeurs CASCADE;
DROP TABLE IF EXISTS Avis CASCADE;
DROP TABLE IF EXISTS SupportTickets CASCADE;
DROP TABLE IF EXISTS TypesNotifications CASCADE;
DROP TABLE IF EXISTS Categories CASCADE;
DROP TABLE IF EXISTS Unites CASCADE;
DROP TABLE IF EXISTS Utilisateurs CASCADE;
DROP TABLE IF EXISTS EtatStatuts CASCADE;

-- Suppression des types personnalisés
DROP TYPE IF EXISTS role_enum CASCADE;
DROP TYPE IF EXISTS rappel_enum CASCADE;
DROP TYPE IF EXISTS statut_demande_enum CASCADE;
DROP TYPE IF EXISTS statut_ticket_enum CASCADE;
DROP TYPE IF EXISTS mode_paiement_enum CASCADE;
DROP TYPE IF EXISTS statut_boutique_enum CASCADE;

-- =============================
-- Types personnalisés
-- =============================
CREATE TYPE role_enum AS ENUM ('admin', 'vendeur', 'client');
CREATE TYPE rappel_enum AS ENUM ('matin', 'soir', 'nuit');
CREATE TYPE statut_demande_enum AS ENUM ('en_attente', 'valide', 'rejete');
CREATE TYPE statut_ticket_enum AS ENUM ('ouvert', 'accepté', 'refusé');
CREATE TYPE mode_paiement_enum AS ENUM ('carte', 'virement', 'espèces');
CREATE TYPE statut_boutique_enum AS ENUM ('active', 'inactive');

-- =============================
-- Table EtatStatuts
-- =============================
CREATE TABLE EtatStatuts (
    id_statut SERIAL PRIMARY KEY,
    contexte VARCHAR(50) NOT NULL,
    libelle VARCHAR(50) NOT NULL,
    UNIQUE (contexte, libelle)
);

-- =============================
-- Table Utilisateurs
-- =============================
CREATE TABLE Utilisateurs (
    id_user SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) UNIQUE,
    role role_enum NOT NULL DEFAULT 'admin',
    rappels_actives BOOLEAN NOT NULL DEFAULT FALSE,
    rappel_horaire rappel_enum NOT NULL DEFAULT 'soir',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- Table Vendeurs
-- =============================
CREATE TABLE Vendeurs (
    id_vendeur SERIAL PRIMARY KEY,
    nationalite VARCHAR(100) NOT NULL,
    id_user INTEGER NOT NULL,
    statut VARCHAR(50) NOT NULL DEFAULT 'pending',
    categories_verrouillees BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_user) REFERENCES Utilisateurs(id_user) ON DELETE CASCADE
);

-- =============================
-- Table Boutiques
-- =============================
CREATE TABLE Boutiques (
    id_boutique SERIAL PRIMARY KEY,
    nom_boutique VARCHAR(100) NOT NULL,
    logo_boutique VARCHAR(255),
    banniere_boutique VARCHAR(255),
    description TEXT,
    adresse_boutique VARCHAR(255) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    statut statut_boutique_enum NOT NULL DEFAULT 'active',
    id_vendeur INTEGER NOT NULL UNIQUE, -- 1 vendeur = 1 boutique
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vendeur) REFERENCES Vendeurs(id_vendeur) ON DELETE CASCADE
);

-- =============================
-- Table Clients
-- =============================
CREATE TABLE Clients (
    id_client SERIAL PRIMARY KEY,
    adresse_facturation TEXT NOT NULL,
    solde DECIMAL(10, 2) NOT NULL DEFAULT 250000.00,
    id_user INTEGER NOT NULL,
    FOREIGN KEY (id_user) REFERENCES Utilisateurs(id_user) ON DELETE CASCADE
);

-- =============================
-- Table Categories
-- =============================
CREATE TABLE Categories (
    id_categorie SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    parent_id INTEGER,
    niveau INTEGER NOT NULL DEFAULT 1,
    ordre_affichage INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (parent_id) REFERENCES Categories(id_categorie) ON DELETE CASCADE
);

-- =============================
-- Table VendeurCategories (Préférences catégories par vendeur)
-- =============================
CREATE TABLE VendeurCategories (
    id SERIAL PRIMARY KEY,
    id_vendeur INTEGER NOT NULL,
    id_categorie INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vendeur) REFERENCES Vendeurs(id_vendeur) ON DELETE CASCADE,
    FOREIGN KEY (id_categorie) REFERENCES Categories(id_categorie) ON DELETE CASCADE,
    UNIQUE(id_vendeur, id_categorie)
);

-- =============================
-- Table Unites
-- =============================
CREATE TABLE Unites (
    id_unite SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE,
    symbole VARCHAR(10) NOT NULL UNIQUE
);

-- =============================
-- Table CategorieUnites (Association Unités / Catégories)
-- =============================
CREATE TABLE CategorieUnites (
    id SERIAL PRIMARY KEY,
    id_categorie INTEGER NOT NULL,
    id_unite INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categorie) REFERENCES Categories(id_categorie) ON DELETE CASCADE,
    FOREIGN KEY (id_unite) REFERENCES Unites(id_unite) ON DELETE CASCADE,
    UNIQUE(id_categorie, id_unite)
);

-- =============================
-- Table Produits
-- =============================
CREATE TABLE Produits (
    id_produit SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    image VARCHAR(255) DEFAULT 'default.jpg',
    description TEXT,
    prix_unite DECIMAL(10, 2) NOT NULL DEFAULT 0,
    vues INTEGER DEFAULT 0,
    ventes INTEGER DEFAULT 0,
    id_categorie INTEGER,
    id_unite INTEGER,
    id_vendeur INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categorie) REFERENCES Categories(id_categorie) ON DELETE SET NULL,
    FOREIGN KEY (id_unite) REFERENCES Unites(id_unite) ON DELETE SET NULL,
    FOREIGN KEY (id_vendeur) REFERENCES Vendeurs(id_vendeur) ON DELETE CASCADE
);

-- =============================
-- Table Stocks
-- =============================
CREATE TABLE Stocks (
    id_stock SERIAL PRIMARY KEY,
    quantite INTEGER NOT NULL DEFAULT 0,
    seuil_alerte INTEGER NOT NULL DEFAULT 10,
    seuil_critique INTEGER NOT NULL DEFAULT 5,
    id_produit INTEGER NOT NULL UNIQUE, -- 1 produit = 1 ligne de stock
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produit) REFERENCES Produits(id_produit) ON DELETE CASCADE
);

-- =============================
-- Table Commandes
-- =============================
CREATE TABLE Commandes (
    id_commande SERIAL PRIMARY KEY,
    id_statut INTEGER NOT NULL,
    id_client INTEGER NOT NULL,
    id_vendeur INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_client) REFERENCES Clients(id_client) ON DELETE CASCADE, 
    FOREIGN KEY (id_vendeur) REFERENCES Vendeurs(id_vendeur) ON DELETE CASCADE,
    FOREIGN KEY (id_statut) REFERENCES EtatStatuts(id_statut)
);

-- =============================
-- Table DetailCommandes
-- =============================
CREATE TABLE DetailCommandes (
    id_detail SERIAL PRIMARY KEY,
    quantite DECIMAL(10,2) NOT NULL DEFAULT 0,
    prix_unitaire DECIMAL(10,2) NOT NULL DEFAULT 0,
    id_commande INTEGER NOT NULL,
    id_produit INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_commande) REFERENCES Commandes(id_commande) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES Produits(id_produit) ON DELETE CASCADE
);

-- =============================
-- Table Ventes
-- =============================
CREATE TABLE Ventes (
    id_vente SERIAL PRIMARY KEY,
    montant_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    id_statut INTEGER NOT NULL,
    id_commande INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_commande) REFERENCES Commandes(id_commande) ON DELETE CASCADE,
    FOREIGN KEY (id_statut) REFERENCES EtatStatuts(id_statut)
);

-- =============================
-- Table Factures
-- =============================
CREATE TABLE Factures (
    id_facture SERIAL PRIMARY KEY,
    numero_facture VARCHAR(50) NOT NULL UNIQUE,
    montant DECIMAL(10,2) NOT NULL DEFAULT 0,
    id_statut INTEGER NOT NULL,
    id_vente INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vente) REFERENCES Ventes(id_vente) ON DELETE CASCADE,
    FOREIGN KEY (id_statut) REFERENCES EtatStatuts(id_statut)
);

-- =============================
-- Table Paiements
-- =============================
CREATE TABLE Paiements (
    id_paiement SERIAL PRIMARY KEY,
    montant_paye DECIMAL(10,2) NOT NULL DEFAULT 0,
    mode_paiement mode_paiement_enum NOT NULL DEFAULT 'espèces',
    id_statut INTEGER NOT NULL,
    id_facture INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_facture) REFERENCES Factures(id_facture) ON DELETE CASCADE,
    FOREIGN KEY (id_statut) REFERENCES EtatStatuts(id_statut)
);

-- =============================
-- Table Livraisons
-- =============================
CREATE TABLE Livraisons (
    id_livraison SERIAL PRIMARY KEY,
    adresse TEXT,
    id_statut INTEGER NOT NULL,
    id_commande INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_commande) REFERENCES Commandes(id_commande) ON DELETE CASCADE,
    FOREIGN KEY (id_statut) REFERENCES EtatStatuts(id_statut)
);

-- =============================
-- Table TypesNotifications
-- =============================
CREATE TABLE TypesNotifications (
    id_type_notif SERIAL PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
);

-- =============================
-- Table DevenirVendeurs
-- =============================
CREATE TABLE DevenirVendeurs (
    id_devenirvendeur SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20) NOT NULL,
    nationalite VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nom_boutique VARCHAR(255) NOT NULL,
    statut statut_demande_enum NOT NULL DEFAULT 'en_attente',
    motif_rejet TEXT,
    id_user INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES Utilisateurs(id_user) ON DELETE SET NULL
);

-- =============================
-- Table SupportTickets
-- =============================
CREATE TABLE SupportTickets (
    id_support_ticket SERIAL PRIMARY KEY,
    vendeur_id INTEGER NOT NULL REFERENCES Vendeurs(id_vendeur) ON DELETE CASCADE,
    raison TEXT NOT NULL,
    status statut_ticket_enum NOT NULL DEFAULT 'ouvert',
    admin_id INTEGER REFERENCES Utilisateurs(id_user) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================
-- Table Notifications
-- =============================
CREATE TABLE Notifications (
    id_notif SERIAL PRIMARY KEY,
    message TEXT,
    notif_lu BOOLEAN DEFAULT FALSE,
    id_user INTEGER NOT NULL,
    id_type_notif INTEGER NOT NULL,
    id_devenirvendeur INTEGER,
    id_support_ticket INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES Utilisateurs(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_type_notif) REFERENCES TypesNotifications(id_type_notif),
    FOREIGN KEY (id_devenirvendeur) REFERENCES DevenirVendeurs(id_devenirvendeur) ON DELETE CASCADE,
    FOREIGN KEY (id_support_ticket) REFERENCES SupportTickets(id_support_ticket) ON DELETE CASCADE
);

-- =============================
-- Table Avis
-- =============================
CREATE TABLE Avis (
    id_avis SERIAL PRIMARY KEY,
    note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
    commentaire TEXT,
    id_user INTEGER NOT NULL,
    id_boutique INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES Utilisateurs(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_boutique) REFERENCES Boutiques(id_boutique) ON DELETE CASCADE
);

-- =============================
-- Fonction pour mettre à jour automatiquement updated_at
-- =============================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================
-- Triggers pour les tables avec updated_at
-- =============================
CREATE TRIGGER update_utilisateurs_updated_at
BEFORE UPDATE ON Utilisateurs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boutiques_updated_at
BEFORE UPDATE ON Boutiques
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produits_updated_at
BEFORE UPDATE ON Produits
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commandes_updated_at
BEFORE UPDATE ON Commandes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_detailcommandes_updated_at
BEFORE UPDATE ON DetailCommandes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ventes_updated_at
BEFORE UPDATE ON Ventes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_factures_updated_at
BEFORE UPDATE ON Factures
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paiements_updated_at
BEFORE UPDATE ON Paiements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_livraisons_updated_at
BEFORE UPDATE ON Livraisons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON Notifications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stocks_updated_at
BEFORE UPDATE ON Stocks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supporttickets_updated_at
BEFORE UPDATE ON SupportTickets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_avis_updated_at
BEFORE UPDATE ON Avis
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
