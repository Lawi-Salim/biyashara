import React, { useState, useEffect } from 'react';
import apiService from '../../../apiService';
import NoDataFound from '../../../components/common/NoDataFound';
import ErrorDataFound from '../../../components/common/ErrorDataFound';
import SpinnerLoading from '../../../components/SpinnerLoading';
import './styleAdmin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [unites, setUnites] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
                const response = await apiService.get('/produits/all');
        setProducts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        setError('Impossible de charger les produits.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
            const response = await apiService.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };  

  const fetchUnites = async () => {
    try {
            const response = await apiService.get('/unites');
      setUnites(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des unités:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchUnites();
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
      ) : error ? (
        <div className="empty-card">
          <ErrorDataFound message={error} />
        </div>
      ) : products.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Unité</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Vendeur</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id_produit}>
                <td>{product.id_produit}</td>
                <td><img src={product.image} alt={product.nom} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}/></td>
                <td>{product.nom}</td>
                <td>{categories.find(cat => cat.id_categorie === product.id_categorie)?.nom || 'N/A'}</td>
                <td>{unites.find(un => un.id_unite === product.id_unite)?.nom || 'N/A'}</td>
                <td>{product.prix_unite}</td>
                <td>{product.stock ? product.stock.quantite : 'N/A'}</td>
                <td>{product.nom_vendeur}</td>
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
