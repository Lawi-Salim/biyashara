// Configuration de l'encodage pour les caractères spéciaux
process.env.NODE_OPTIONS = '--no-warnings';
process.env.NODE_ENV = 'development';
process.env.PGCLIENTENCODING = 'UTF-8';

const { sequelize } = require('../database');
const db = require('../models');
const bcrypt = require('bcryptjs');

const { 
  initModels, 
  Utilisateur, 
  Vendeur, 
  Client, 
  Boutique, 
  Categorie, 
  Produit, 
  Unite, 
  Stock, 
  DevenirVendeur, 
  SupportTicket, 
  TypesNotification, 
  Notification, 
  EtatStatut, 
  Commande, 
  DetailCommande, 
  Vente, 
  Facture, 
  Paiement, 
  Livraison, 
  CategorieUnite, 
  VendeurCategorie, 
  Avis 
} = require('../models');

// Mesure du temps de démarrage
const startTime = Date.now();

const resetAppData = async () => {
  try {
    // Forcer l'encodage de la session à UTF8
    await sequelize.query(`SET client_encoding TO 'UTF8';`);
    console.log('Encodage de la session client défini sur UTF8.');

    console.log('Réinitialisation complète de la base de données PostgreSQL...');

    // Désactiver temporairement les triggers pour éviter les erreurs de contraintes
    await sequelize.query('SET session_replication_role = "replica"');

    // Vider les tables dans l'ordre inverse des dépendances
    const tables = [
      'paiements',
      'factures',
      'livraisons',
      'ventes',
      'detailcommandes',
      'commandes',
      'stocks',
      'produits',
      'boutiques',
      'vendeurcategories',
      'vendeurs',
      'clients',
      'utilisateurs',
      'categories',
      'unites',
      'notifications',
      'devenirvendeurs',
      'supporttickets',
      'etatstatuts',
      'typesnotifications',
      'avis'
    ];

    for (const table of tables) {
      try {
        // Vérifier si la table existe avant de tenter de la vider
        const tableExists = await sequelize.query(
          `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${table}')`,
          { type: sequelize.QueryTypes.SELECT }
        );
        
        if (tableExists[0].exists) {
          await sequelize.query(`TRUNCATE TABLE "${table}" CASCADE`);
          console.log(`Table ${table} vidée`);
        } else {
          console.log(`Table ${table} non trouvée, ignorée`);
        }
      } catch (error) {
        console.error(`Erreur lors de la suppression de la table ${table}:`, error.message);
      }
    }

    // Réactiver les triggers
    await sequelize.query('SET session_replication_role = "origin"');

    // Réinitialiser les séquences
    await sequelize.query(`
      SELECT setval(pg_get_serial_sequence('utilisateurs', 'id_user'), 1, false);
      SELECT setval(pg_get_serial_sequence('vendeurs', 'id_vendeur'), 1, false);
      SELECT setval(pg_get_serial_sequence('clients', 'id_client'), 1, false);
      SELECT setval(pg_get_serial_sequence('categories', 'id_categorie'), 1, false);
      SELECT setval(pg_get_serial_sequence('unites', 'id_unite'), 1, false);
      SELECT setval(pg_get_serial_sequence('produits', 'id_produit'), 1, false);
      SELECT setval(pg_get_serial_sequence('stocks', 'id_stock'), 1, false);
      SELECT setval(pg_get_serial_sequence('commandes', 'id_commande'), 1, false);
      SELECT setval(pg_get_serial_sequence('detailcommandes', 'id_detail'), 1, false);
      SELECT setval(pg_get_serial_sequence('ventes', 'id_vente'), 1, false);
      SELECT setval(pg_get_serial_sequence('factures', 'id_facture'), 1, false);
      SELECT setval(pg_get_serial_sequence('paiements', 'id_paiement'), 1, false);
      SELECT setval(pg_get_serial_sequence('livraisons', 'id_livraison'), 1, false);
      SELECT setval(pg_get_serial_sequence('notifications', 'id_notif'), 1, false);
      SELECT setval(pg_get_serial_sequence('devenirvendeurs', 'id_devenirvendeur'), 1, false);
      SELECT setval(pg_get_serial_sequence('boutiques', 'id_boutique'), 1, false);
      SELECT setval(pg_get_serial_sequence('vendeurcategories', 'id'), 1, false);
      SELECT setval(pg_get_serial_sequence('etatstatuts', 'id_statut'), 1, false);
      SELECT setval(pg_get_serial_sequence('typesnotifications', 'id_type_notif'), 1, false);
      SELECT setval(pg_get_serial_sequence('supporttickets', 'id_support_ticket'), 1, false);
      SELECT setval(pg_get_serial_sequence('avis', 'id_avis'), 1, false);
    `);

    console.log('Toutes les séquences ont été réinitialisées');


    // Créer les catégories hiérarchiques
    console.log('Début de la création des catégories...');
    
    // Grandes familles (niveau 1)
    const grandesFamilles = [
      { nom: 'Mode & Lifestyle', niveau: 1, ordre_affichage: 1 },
      { nom: 'Technologie', niveau: 1, ordre_affichage: 2 },
      { nom: 'Maison & Vie quotidienne', niveau: 1, ordre_affichage: 3 },
      { nom: 'Bien-être', niveau: 1, ordre_affichage: 4 },
      { nom: 'Famille', niveau: 1, ordre_affichage: 5 },
      { nom: 'Mobilité', niveau: 1, ordre_affichage: 6 },
      { nom: 'Loisirs', niveau: 1, ordre_affichage: 7 }
    ];

    // Créer d'abord les grandes familles
    const famillesCreees = {};
    for (const famille of grandesFamilles) {
      try {
        console.log(`Création de la grande famille: ${famille.nom}`);
        const [instance, created] = await Categorie.findOrCreate({
          where: { nom: famille.nom },
          defaults: famille
        });
        famillesCreees[famille.nom] = instance.id_categorie;
        console.log(`Grande famille ${famille.nom}: ${created ? 'créée' : 'existe déjà'}`);
      } catch (error) {
        console.error(`ERREUR lors de la création de la famille ${famille.nom}:`, error);
      }
    }

    // Sous-catégories (niveau 2)
    const sousCategories = [
      // Mode & Lifestyle
      { nom: 'Vêtements', parent: 'Mode & Lifestyle', niveau: 2, ordre_affichage: 1 },
      { nom: 'Chaussures', parent: 'Mode & Lifestyle', niveau: 2, ordre_affichage: 2 },
      { nom: 'Accessoires & Bijoux', parent: 'Mode & Lifestyle', niveau: 2, ordre_affichage: 3 },
      
      // Technologie
      { nom: 'Téléphones', parent: 'Technologie', niveau: 2, ordre_affichage: 1 },
      { nom: 'Informatique', parent: 'Technologie', niveau: 2, ordre_affichage: 2 },
      { nom: 'Électronique', parent: 'Technologie', niveau: 2, ordre_affichage: 3 },
      
      // Maison & Vie quotidienne
      { nom: 'Maison & Décoration', parent: 'Maison & Vie quotidienne', niveau: 2, ordre_affichage: 1 },
      { nom: 'Électroménager', parent: 'Maison & Vie quotidienne', niveau: 2, ordre_affichage: 2 },
      { nom: 'Alimentation', parent: 'Maison & Vie quotidienne', niveau: 2, ordre_affichage: 3 },
      
      // Bien-être
      { nom: 'Beauté & Cosmétiques', parent: 'Bien-être', niveau: 2, ordre_affichage: 1 },
      { nom: 'Santé & Bien-être', parent: 'Bien-être', niveau: 2, ordre_affichage: 2 },
      
      // Famille
      { nom: 'Bébés & Enfants', parent: 'Famille', niveau: 2, ordre_affichage: 1 },
      { nom: 'Papeterie', parent: 'Famille', niveau: 2, ordre_affichage: 2 },
      { nom: 'Livres scolaires', parent: 'Famille', niveau: 2, ordre_affichage: 3 },
      
      // Mobilité
      { nom: 'Auto', parent: 'Mobilité', niveau: 2, ordre_affichage: 1 },
      { nom: 'Moto', parent: 'Mobilité', niveau: 2, ordre_affichage: 2 },
      { nom: 'Accessoires véhicules', parent: 'Mobilité', niveau: 2, ordre_affichage: 3 },
      
      // Loisirs
      { nom: 'Sports', parent: 'Loisirs', niveau: 2, ordre_affichage: 1 },
      { nom: 'Jeux', parent: 'Loisirs', niveau: 2, ordre_affichage: 2 },
      { nom: 'Musique', parent: 'Loisirs', niveau: 2, ordre_affichage: 3 },
      { nom: 'Instruments', parent: 'Loisirs', niveau: 2, ordre_affichage: 4 }
    ];

    // Créer les sous-catégories
    for (const sousCategorie of sousCategories) {
      try {
        const parentId = famillesCreees[sousCategorie.parent];
        if (!parentId) {
          console.error(`Parent ${sousCategorie.parent} non trouvé pour ${sousCategorie.nom}`);
          continue;
        }

        console.log(`Création de la sous-catégorie: ${sousCategorie.nom}`);
        const [instance, created] = await Categorie.findOrCreate({
          where: { nom: sousCategorie.nom },
          defaults: {
            nom: sousCategorie.nom,
            parent_id: parentId,
            niveau: sousCategorie.niveau,
            ordre_affichage: sousCategorie.ordre_affichage
          }
        });
        console.log(`Sous-catégorie ${sousCategorie.nom}: ${created ? 'créée' : 'existe déjà'}`);
      } catch (error) {
        console.error(`ERREUR lors de la création de la sous-catégorie ${sousCategorie.nom}:`, error);
      }
    }
    
    // Vérification finale
    const count = await Categorie.count();
    console.log(`✅ ${count} catégorie(s) au total dans la base de données`);

    // Créer les nouvelles unités
    console.log('Début de la création des unités...');
    const unites = [
      // Quantité
      { nom: 'Pièce', symbole: 'pce' },
      { nom: 'Paire', symbole: 'paire' },
      { nom: 'Lot', symbole: 'lot' },
      { nom: 'Ensemble', symbole: 'ens' },
      { nom: 'Kit', symbole: 'kit' },
      { nom: 'Boîte / Pack', symbole: 'pack' },
      // Mesure
      { nom: 'Kilogramme', symbole: 'kg' },
      { nom: 'Gramme', symbole: 'g' },
      { nom: 'Litre', symbole: 'L' },
      { nom: 'Millilitre', symbole: 'ml' },
      { nom: 'Mètre', symbole: 'm' },
      { nom: 'Mètre carré', symbole: 'm²' },
      // Vêtements & Chaussures
      { nom: 'Taille', symbole: 'taille' }, // Pour S, M, L etc.
      { nom: 'Pointure', symbole: 'pt' } // Pour 42, 43 etc.
    ];

    for (const unite of unites) {
      await Unite.findOrCreate({
        where: { nom: unite.nom },
        defaults: unite
      });
    }
    console.log(`✅ ${unites.length} unités créées ou vérifiées.`);

    // Associer les unités aux catégories
    console.log('Début de l\`association des unités aux catégories...');
    const associations = {
      // Mode & Lifestyle
      'Vêtements': ['Pièce', 'Taille', 'Ensemble', 'Lot'],
      'Chaussures': ['Paire', 'Pointure'],
      'Accessoires & Bijoux': ['Pièce', 'Ensemble'],
      // Technologie
      'Téléphones': ['Pièce', 'Kit'],
      'Informatique': ['Pièce', 'Kit'],
      'Électronique': ['Pièce', 'Kit'],
      // Maison & Vie quotidienne
      'Maison & Décoration': ['Pièce', 'Ensemble', 'Mètre', 'Mètre carré'],
      'Électroménager': ['Pièce'],
      'Alimentation': ['Pièce', 'Lot', 'Boîte / Pack', 'Kilogramme', 'Gramme', 'Litre'],
      // Bien-être
      'Beauté & Cosmétiques': ['Pièce', 'Kit', 'Millilitre', 'Litre', 'Gramme'],
      'Santé & Bien-être': ['Pièce', 'Boîte / Pack'],
      // Famille
      'Bébés & Enfants': ['Pièce', 'Taille', 'Lot', 'Ensemble'],
      'Papeterie': ['Pièce', 'Lot', 'Boîte / Pack'],
      'Livres scolaires': ['Pièce', 'Lot', 'Boîte / Pack'],
      // Mobilité
      'Auto': ['Pièce', 'Kit', 'Litre'],
      'Moto': ['Pièce', 'Kit', 'Litre'],
      'Accessoires véhicules': ['Pièce', 'Kit'],
      // Loisirs
      'Sports': ['Pièce', 'Kit', 'Paire', 'Ensemble'],
      'Jeux': ['Pièce', 'Kit', 'Ensemble'],
      'Musique': ['Pièce', 'Kit'],
      'Instruments': ['Pièce', 'Kit']
    };

    for (const nomCategorie in associations) {
      const categorie = await Categorie.findOne({ where: { nom: nomCategorie } });
      if (categorie) {
        const nomsUnites = associations[nomCategorie];
        for (const nomUnite of nomsUnites) {
          const unite = await Unite.findOne({ where: { nom: nomUnite } });
          if (unite) {
            await CategorieUnite.findOrCreate({
              where: {
                id_categorie: categorie.id_categorie,
                id_unite: unite.id_unite
              }
            });
          }
        }
      }
    }
    console.log('✅ Associations unités/catégories créées.');

    // Créer les états de statuts avec des caractères échappés
    try {
      const etatStatuts = [
        // Commandes
        { contexte: 'commande', libelle: 'en attente' },
        { contexte: 'commande', libelle: 'valid\u00e9e' }, // validée
        { contexte: 'commande', libelle: 'en pr\u00e9paration' }, // en préparation
        { contexte: 'commande', libelle: 'en cours de livraison' },
        { contexte: 'commande', libelle: 'livr\u00e9e' }, // livrée
        { contexte: 'commande', libelle: 'annul\u00e9e' }, // annulée
        
        // Ventes
        { contexte: 'vente', libelle: 'en cours' },
        { contexte: 'vente', libelle: 'termin\u00e9e' }, // terminée
        { contexte: 'vente', libelle: 'annul\u00e9e' }, // annulée
        
        // Livraisons
        { contexte: 'livraison', libelle: 'en pr\u00e9paration' }, // en préparation
        { contexte: 'livraison', libelle: 'en cours' },
        { contexte: 'livraison', libelle: 'livr\u00e9e' }, // livrée
        
        // Paiements
        { contexte: 'paiement', libelle: 'en attente' },
        { contexte: 'paiement', libelle: 'pay\u00e9' }, // payé
        { contexte: 'paiement', libelle: 'annul\u00e9' } // annulé
      ];

      for (const etat of etatStatuts) {
        try {
          await EtatStatut.findOrCreate({
            where: { 
              contexte: etat.contexte, 
              libelle: etat.libelle 
            },
            defaults: etat
          });
        } catch (error) {
          console.error(`Erreur lors de la création de l'état ${etat.contexte} - ${etat.libelle}:`, error.message);
        }
      }
      console.log('✅ États de statuts créés');
    } catch (error) {
      console.error('❌ Erreur lors de la création des états de statuts:', error);
      throw error;
    }
    console.log('✅ États de statuts créés');

    // Créer les types de notifications
    const typesNotifications = [
      { libelle: 'alert' },
      { libelle: 'info' },
      { libelle: 'confirmation' },
      { libelle: 'demande_vendeur' },
      { libelle: 'approbation_vendeur' },
      { libelle: 'rejet_vendeur' },
      { libelle: 'new_order' },
      { libelle: 'payment_received' },
      { libelle: 'new_product' }
    ];
    
    for (const type of typesNotifications) {
      await TypesNotification.findOrCreate({
        where: { libelle: type.libelle },
        defaults: type
      });
    }
    console.log('✅ Types de notifications créés');

    // Créer les utilisateurs de test
    const hashedPassword = await bcrypt.hash('12345678', 10);
    const users = [
      {
        nom: 'Dahlawi Ibrahim',
        email: 'dahlawi@gmail.com',
        password: hashedPassword,
        role: 'admin',
        telephone: '+2694340004'
      },
      {
        nom: 'Salim Ibrahim',
        email: 'salim@gmail.com',
        password: hashedPassword,
        role: 'vendeur',
        telephone: '+2694340005'
      },
      {
        nom: 'Mariama Salim',
        email: 'mariama@gmail.com',
        password: hashedPassword,
        role: 'vendeur',
        telephone: '+2694340006'
      },
      {
        nom: 'Fatima Ibrahim',
        email: 'fatima@gmail.com',
        password: hashedPassword,
        role: 'client',
        telephone: '+2694340007'
      },
      {
        nom: 'Dianti Ismael',
        email: 'dianti@gmail.com',
        password: hashedPassword,
        role: 'client',
        telephone: '+2694340008'
      }
    ];

    for (const user of users) {
      const [createdUser, created] = await Utilisateur.findOrCreate({
        where: { email: user.email },
        defaults: {
          nom: user.nom,
          email: user.email,
          password: user.password,
          role: user.role,
          telephone: user.telephone
        }
      });

      if (created) {
        if (user.role === 'vendeur') {
          const vendeur = await Vendeur.create({
            nationalite: 'Comorienne',
            id_user: createdUser.id_user,
            statut: 'actif'
          });

          // Création des boutiques pour les vendeurs
          const nomBoutique = `Boutique de ${user.nom}`;
          const boutiquesData = [
            {
              nom_boutique: nomBoutique,
              description: 'Articles de mode et électroniques.',
              adresse_boutique: 'Moroni, Comores',
              id_vendeur: vendeur.id_vendeur,
            },
          ];
          await Boutique.bulkCreate(boutiquesData, { individualHooks: true });
        } else if (user.role === 'client') {
          await Client.create({
            adresse_facturation: 'Adresse par défaut',
            id_user: createdUser.id_user
          });
        }
      }
    }
    console.log('✅ Utilisateurs de test créés');


    const endTime = Date.now();
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Réinitialisation terminée avec succès en ${executionTime} secondes`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation des données :', error);
    process.exit(1);
  }
};

// Exécuter la fonction de réinitialisation
resetAppData();
