import React, { useState, useEffect } from 'react';
import apiService from '../../../apiService';
import NoDataFound from '../../../components/common/NoDataFound';
import ErrorDataFound from '../../../components/common/ErrorDataFound';
import SpinnerLoading from '../../../components/SpinnerLoading';
import Modal from '../../../components/Modal';
import './styleClient.css';

const ClientOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {

        // const data = await apiService.get('/me/orders');
        // setOrders(data);
        setOrders([]); // TODO: Remplacer par les données de l'API
      } catch (error) {
        console.error('Erreur lors de la récupération de vos commandes:', error);
        setError('Impossible de charger vos commandes.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <div className="client-orders-container">
        <h2 className="client-title">Mes Commandes</h2>
        {loading ? (
          <div className="empty-card">
            <div className="loading-container">
              <SpinnerLoading size="large" color='var(--primary-500)' />
              <p>Chargement des commandes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="empty-card">
            <ErrorDataFound message={error} />
          </div>
        ) : orders.length > 0 ? (
          <table className="client-table">
            <thead>
              <tr>
                <th>ID Commande</th>
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
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{order.total}€</td>
                  <td>{order.statut}</td>
                  <td>
                    <button className="btn-details">Voir Détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-card">
            <NoDataFound message="Vous n'avez aucune commande pour le moment." />
          </div>
        )}
      </div>
    </>
  );
};

export default ClientOrders;
