import React, { useState, useEffect } from 'react';
import apiService from '../../../apiService';
import { useToast } from '../../../context/ToastContext';
import { useNotification } from '../../../context/NotificationContext';
import SpinnerLoading from '../../../components/SpinnerLoading';
import NoDataFound from '../../../components/common/NoDataFound';
import ErrorDataFound from '../../../components/common/ErrorDataFound';

import Modal from '../../../components/Modal';

const AdminNotifications = ({ selectedType }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  const { decrementCount } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const formatLabel = (label) => {
    if (!label) return '';
    const spacedLabel = label.replace(/_/g, ' ');
    return spacedLabel.charAt(0).toUpperCase() + spacedLabel.slice(1);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const params = {};
        if (selectedType) {
          params.type = selectedType;
        }

        const { data } = await apiService.get('/notifications/admin', {
          params,
        });
        console.log('Notifications admin reçues:', data);
        setNotifications(data);
      } catch (err) {
        const errorMessage = 'Impossible de charger les notifications admin.';
        setError(errorMessage);
        addToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [selectedType, addToast]);

  const handleMarkAsRead = async (id) => {
    try {
      const { data } = await apiService.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => (n.id_notif === id ? data : n)));
      addToast('Notification marquée comme lue.', 'success');
    } catch (err) {
      addToast('Erreur lors de la mise à jour.', 'error');
    }
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
    if (!notification.notif_lu) {
      handleMarkAsRead(notification.id_notif);
      decrementCount();
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const { data } = await apiService.post(`/admin/seller-requests/${requestId}/approve`);
      addToast(data.message, 'success');
      // Mettre à jour la liste des notifications pour refléter le changement
      setNotifications(prev => prev.filter(n => n.demande_vendeur?.id_devenirvendeur !== requestId));
      setIsModalOpen(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Erreur lors de l\'approbation.', 'error');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const { data } = await apiService.post(`/admin/seller-requests/${requestId}/decline`);
      addToast(data.message, 'info');
      setNotifications(prev => prev.filter(n => n.demande_vendeur?.id_devenirvendeur !== requestId));
      setIsModalOpen(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Erreur lors du refus.', 'error');
    }
  };

  if (loading) return( 
    <div className="empty-card">
      <div className="loading-container">
        <SpinnerLoading size="large" color='var(--primary-500)' />
        <p>Chargement des notifications...</p>
      </div>
  </div>
  );

  if (error) return(
    <div className="empty-card">
      <ErrorDataFound message={error} />
    </div>
  )

  if (notifications.length === 0) return(
    <div className="empty-card">
      <NoDataFound message="Aucune commande à afficher pour le moment." />
    </div>
  );

  return (
    <>
      <table className="admin-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Message</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {notifications.map(notif => (
          <tr key={notif.id_notif} className={!notif.notif_lu ? 'notification-unread' : ''}>
            <td>{formatLabel(notif.type_notification?.libelle || 'Info')}</td>
            <td>{notif.message}</td>
            <td>{new Date(notif.created_at).toLocaleString('fr-FR')}</td>
            <td>
              <button onClick={() => handleViewDetails(notif)} className="btn-details">
                Voir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedNotification && (
          <>
            {selectedNotification.type_notification?.libelle === 'demande_vendeur' && selectedNotification.demande_vendeur ? (
              <div className="notification-modal-content">
                <h3 className="modal-title">Détails de la demande</h3>
                <div className="request-section">
                  <div className="detail-item">
                    <span className="detail-label">Nom du demandeur:</span>
                    <span className="detail-value">{selectedNotification.demande_vendeur.nom}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedNotification.demande_vendeur.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Téléphone:</span>
                    <span className="detail-value">{selectedNotification.demande_vendeur.telephone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nationalité:</span>
                    <span className="detail-value">{selectedNotification.demande_vendeur.nationalite}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nom de la boutique:</span>
                    <span className="detail-value">{selectedNotification.demande_vendeur.nom_boutique}</span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button 
                    onClick={() => handleApproveRequest(selectedNotification.demande_vendeur.id_devenirvendeur)} 
                    className="btn btn-success"
                  >
                    Approuver
                  </button>
                  <button 
                    onClick={() => handleDeclineRequest(selectedNotification.demande_vendeur.id_devenirvendeur)} 
                    className="btn btn-danger"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            ) : (
              <div className="notification-modal-content">
                <h3 className="modal-title">Détails de la notification</h3>
                {selectedNotification.support_ticket ? (
                  <div className="request-section">
                    <div className="detail-item">
                      <span className="detail-label">Boutique:</span>
                      <span className="detail-value">{selectedNotification.support_ticket.vendeur?.boutique?.nom_boutique || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Demandeur:</span>
                      <span className="detail-value">{selectedNotification.support_ticket.vendeur?.utilisateur?.nom || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Raison:</span>
                      <span className="detail-value">{selectedNotification.support_ticket.raison}</span>
                    </div>
                  </div>
                ) : (
                  <div className="notification-section">
                    <div className="detail-item">
                      <span className="detail-label">Message:</span>
                      <span className="detail-value">{selectedNotification.message}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default AdminNotifications;
