import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import NoDataFound from '../../components/common/NoDataFound';
import UserAvatar from './UserAvatar';
import apiService from '../../apiService';
import SpinnerLoading from '../../components/SpinnerLoading';
import DashboardLayout from './DashboardLayout';
import Modal from '../../components/Modal'; // Import de la modale
import './Dashboard.css';

const AdminDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersResponse = await apiService.get('/api/admin/users');
        setUsers(usersResponse.data);

        const requestsResponse = await apiService.get('/api/admin/seller-requests');
        setSellerRequests(requestsResponse.data);

      } catch (err) {
        addToast('Impossible de charger les données du tableau de bord.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRequest = async (requestId, action) => {
    try {
      await apiService.post(`/api/admin/seller-requests/${requestId}`, { action });
      setSellerRequests(sellerRequests.filter(req => req.id_devenirvendeur !== requestId));
      addToast(`La demande a été ${action === 'approve' ? 'approuvée' : 'rejetée'}.`, 'success');
      if (action === 'approve') {
        const usersResponse = await apiService.get('/api/admin/users');
        setUsers(usersResponse.data);
      }
    } catch (err) {
      addToast('Une erreur est survenue lors du traitement de la demande.', 'error');
      console.error('Erreur lors de la gestion de la demande:', err);
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Filtrer les utilisateurs pour exclure l'admin et ne garder que les clients et vendeurs
  const filteredUsers = users.filter(u => u.role === 'client' || u.role === 'vendeur');

  return (
    <DashboardLayout>
      {location.pathname === '/admin/dashboard' ? (
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1>Tableau de bord Administrateur</h1>
          </header>

          {loading ? <SpinnerLoading /> : (
            <>
              <div className="dashboard-card">
                <h2>Liste des utilisateurs</h2>
                {filteredUsers.length > 0 ? (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Avatar</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Détails</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id_user}>
                          <td><UserAvatar name={u.nom} size={36} /></td>
                          <td>{u.nom}</td>
                          <td>{u.email}</td>
                          <td>{u.role}</td>
                          <td>
                            <button onClick={() => handleOpenModal(u)} className="btn-details">
                              Voir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <NoDataFound message="Aucun client ou vendeur à afficher." />
                )}
              </div>

              <div className="dashboard-card">
                <h2>Demandes pour devenir vendeur</h2>
                {sellerRequests.length > 0 ? (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Nom de la boutique</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerRequests.map((req) => (
                        <tr key={req.id_devenirvendeur}>
                          <td>{req.nom}</td>
                          <td>{req.email}</td>
                          <td>{req.nom_boutique}</td>
                          <td>{new Date(req.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button onClick={() => handleRequest(req.id_devenirvendeur, 'approve')} className="btn btn-success">Approuver</button>
                              <button onClick={() => handleRequest(req.id_devenirvendeur, 'reject')} className="btn btn-danger">Rejeter</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="empty-state">Aucune demande en attente.</p>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <Outlet />
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedUser && (
          <div className="user-details-content">
            <h2 className="user-details-title">Détails de l'utilisateur</h2>
            <div className="user-details-grid">
              <p><strong>ID:</strong></p><p>{selectedUser.id_user}</p>
              <p><strong>Nom:</strong></p><p>{selectedUser.nom}</p>
              <p><strong>Email:</strong></p><p>{selectedUser.email}</p>
              <p><strong>Rôle:</strong></p><p>{selectedUser.role}</p>
              <p><strong>Inscrit le:</strong></p><p>{new Date(selectedUser.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default AdminDashboard;
