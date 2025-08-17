import React, { useState, useEffect } from 'react';
import apiService from '../../../apiService';
import NoDataFound from '../../../components/common/NoDataFound';
import SpinnerLoading from '../../../components/SpinnerLoading';
import Modal from '../../../components/Modal';
import './styleVendeur.css';

const VendeurProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Pour l'instant, on utilise un tableau vide pour simuler l'absence de données.
        // Décommentez les lignes ci-dessous pour utiliser l'API.
        // const data = await apiService.get('/seller/products');
        // setProducts(data);
        setProducts([]);
      } catch (error) {
        console.error('Erreur lors de la récupération de vos produits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="vendeur-container">
       <div className="vendeur-header">
        <h2 className="vendeur-title">Mes Produits</h2>
        <button className="btn-add-product">Ajouter un produit</button>
      </div>
      {loading ? (
        <div className="empty-card">
          <div className="loading-container">
            <SpinnerLoading size="large" color='var(--primary-500)' />
            <p>Chargement des produits...</p>
          </div>
        </div>
      ) : products.length > 0 ? (
        <table className="vendeur-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.nom}</td>
                <td>{product.categorie}</td>
                <td>{product.prix}€</td>
                <td>{product.stock}</td>
                <td><span className={`status--${product.statut.toLowerCase()}`}>{product.statut}</span></td>
                <td>
                  <button className="btn-edit">Modifier</button>
                  <button className="btn-delete">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-card">
          <NoDataFound 
            message="Vous n'avez aucun produit pour le moment."
            ctaText="Ajouter un produit"
            onCtaClick={() => console.log('Ouvrir le modal d\'ajout')} // TODO: Implémenter la logique modale
          />
        </div>
      )}
    </div>
    </>
  );
};

export default VendeurProducts;
