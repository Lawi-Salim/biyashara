import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../../apiService';
import { useToast } from '../../../context/ToastContext';
import SpinnerLoading from '../../../components/SpinnerLoading';
import NoDataFound from '../../../components/common/NoDataFound';
import ErrorDataFound from '../../../components/common/ErrorDataFound';
import './styleAdmin.css'; // Utilisation du style commun

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: 'ouvert', sortBy: 'createdAt_DESC' });
  const { addToast } = useToast();

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sortBy, order] = filters.sortBy.split('_');
      const params = new URLSearchParams({ status: filters.status, sortBy, order });
      const { data } = await apiService.get(`/admin/support/tickets?${params.toString()}`);
      setTickets(data.tickets);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la récupération des tickets.';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await apiService.put(`/admin/support/tickets/${id}`, { status });
      addToast(`Le ticket a été ${status}.`, 'success');
      fetchTickets(); // Refresh the list
    } catch (err) {
      addToast(err.response?.data?.message || 'Erreur lors de la mise à jour du ticket.', 'error');
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Gestion des Demandes de Support</h2>

      {/* Barre de filtres */}
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="status">Statut :</label>
          <select id="status" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="ouvert">Ouvert</option>
            <option value="accepté">Accepté</option>
            <option value="refusé">Refusé</option>
            <option value="">Tous</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="sortBy">Trier par :</label>
          <select id="sortBy" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="createdAt_DESC">Plus récent</option>
            <option value="createdAt_ASC">Plus ancien</option>
          </select>
        </div>
      </div>

      {/* Contenu principal */}
      {loading ? (
        <div className="empty-card">
          <div className="loading-container">
            <SpinnerLoading size="large" color='var(--primary-500)' />
            <p>Chargement des demandes...</p>
          </div>
        </div>
      ) : error ? (
        <div className="empty-card">
          <ErrorDataFound message={error} />
        </div>
      ) : tickets.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Boutique</th>
              <th style={{ minWidth: '250px' }}>Raison</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.vendeur?.boutique?.nom_boutique || 'N/A'}</td>
                <td className="text-cell">{ticket.raison}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge status-${ticket.status}`}>{ticket.status}</span>
                </td>
                <td>
                  {ticket.status === 'ouvert' && (
                    <div className="action-buttons">
                      <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(ticket.id, 'accepté')}>Accepter</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(ticket.id, 'refusé')}>Refuser</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-card">
          <NoDataFound message="Aucun ticket à afficher pour les filtres sélectionnés." />
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
