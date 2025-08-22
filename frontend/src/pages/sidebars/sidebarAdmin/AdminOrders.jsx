import React, { useState, useEffect } from 'react';
import apiService from '../../../apiService';
import NoDataFound from '../../../components/common/NoDataFound';
import ErrorDataFound from '../../../components/common/ErrorDataFound';
import SpinnerLoading from '../../../components/SpinnerLoading';
import './styleAdmin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // const data = await apiService.get('//orders');
        // setOrders(data);
        setOrders([]); // TODO: Remplacer par les données de l'API
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        setError('Impossible de charger les commandes.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">Gestion des Commandes</h2>
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
        <table className="admin-table">
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
                <td>{order.client}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.total}€</td>
                <td>{order.statut}</td>
                <td>
                  <button className="btn-edit">Détails</button>
                  <button className="btn-delete">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-card">
          <NoDataFound message="Aucune commande à afficher pour le moment." />
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
