import React, { useState, useEffect } from 'react';
import apiService from '../../../apiService';
import { useToast } from '../../../context/ToastContext';
import SpinnerLoading from '../../../components/SpinnerLoading';
import NoDataFound from '../../../components/common/NoDataFound';
import ErrorDataFound from '../../../components/common/ErrorDataFound';

const ClientNotifications = ({ selectedType }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

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

        const { data } = await apiService.get('/notifications/client', {
          params,
        });
        setNotifications(data);
      } catch (err) {
        const errorMessage = 'Impossible de charger les notifications client.';
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

  if (loading) return (
    <div className="empty-card">
      <div className="loading-container">
        <SpinnerLoading size="large" color='var(--primary-500)' />
        <p>Chargement des notifications...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="empty-card">
      <ErrorDataFound message={error} />
    </div>
  );
  
  if (notifications.length === 0) return (
    <div className="empty-card">
      <NoDataFound message="Aucune notification pour le moment." />
    </div>
  );

  return (
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
          <tr key={notif.id_notif} style={{ backgroundColor: notif.notif_lu ? 'transparent' : 'var(--primary-100)' }}>
            <td>{formatLabel(notif.type_notification?.libelle || 'Info')}</td>
            <td>{notif.message}</td>
            <td>{new Date(notif.created_at).toLocaleString('fr-FR')}</td>
            <td>
              {!notif.notif_lu && (
                <button onClick={() => handleMarkAsRead(notif.id_notif)} className="btn-edit">
                  Marquer comme lu
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientNotifications;
