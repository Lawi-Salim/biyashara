import React, { useState, useEffect } from 'react';
import apiService from '../../../apiService';
import NoDataFound from '../../../components/common/NoDataFound';
import SpinnerLoading from '../../../components/SpinnerLoading';
import Modal from '../../../components/Modal';
import './styleVendeur.css';

const VendeurOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // const data = await apiService.get('/seller/orders');
        // setOrders(data);
        setOrders([]); // TODO: Remplacer par les données de l'API
      } catch (error) {
        console.error('Erreur lors de la récupération de vos ventes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <div className="vendeur-container">
      <h2 className="vendeur-title">Mes Ventes</h2>
      {loading ? (
        <div className="empty-card">
          <div className="loading-container">
            <SpinnerLoading size="large" color='var(--primary-500)' />
            <p>Chargement des ventes...</p>
          </div>
        </div>
      ) : orders.length > 0 ? (
        <table className="vendeur-table">
          <thead>
            <tr>
              <th>ID Commande</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.client.nom}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.total}€</td>
                <td>{order.statut}</td>
                <td>
                  <button className="btn-edit">Voir Détails</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-card">
          <NoDataFound message="Vous n'avez aucune vente pour le moment." />
        </div>
      )}
    </div>
    </>
  );
};

export default VendeurOrders;
