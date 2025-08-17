import React, { useState, useEffect } from 'react';
import apiService from '../../../apiService';
import NoDataFound from '../../../components/common/NoDataFound';
import SpinnerLoading from '../../../components/SpinnerLoading';
import './styleAdmin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // const data = await apiService.get('/products');
        // setProducts(data);
        setProducts([]); // TODO: Remplacer par les données de l'API
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">Gestion des Produits</h2>
      {loading ? (
        <div className="empty-card">
          <div className="loading-container">
            <SpinnerLoading size="large" color='var(--primary-500)' />
            <p>Chargement des produits...</p>
          </div>
        </div>
      ) : products.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Vendeur</th>
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
                <td>{product.vendeur.nom}</td>
                <td>
                  <button className="btn-edit">Valider</button>
                  <button className="btn-delete">Rejeter</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-card">
          <NoDataFound message="Aucun produit à afficher pour le moment." />
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
