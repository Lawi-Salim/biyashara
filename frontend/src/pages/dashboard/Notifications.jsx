import React, { useState, useEffect } from 'react';
import apiService from '../../apiService';
import { useAuth } from '../../context/AuthContext';
import AdminNotifications from '../sidebars/sidebarAdmin/AdminNotifications';
import VendeurNotifications from '../sidebars/sidebarVendeur/VendeurNotifications';
import ClientNotifications from '../sidebars/sidebarClient/ClientNotifications';
import SpinnerLoading from '../../components/SpinnerLoading';
import NoDataFound from '../../components/common/NoDataFound';
import './Notifications.css';

const Notifications = () => {
  const { user, loading: authLoading } = useAuth();
  const [notificationTypes, setNotificationTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  const formatLabel = (label) => {
    if (!label) return '';
    const spacedLabel = label.replace(/_/g, ' ');
    return spacedLabel.charAt(0).toUpperCase() + spacedLabel.slice(1);
  };

  useEffect(() => {
    const fetchNotificationTypes = async () => {
      try {
        const { data } = await apiService.get('/notifications/types');
        setNotificationTypes(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des types de notifications", error);
      }
    };

    fetchNotificationTypes();
  }, []);

  if (authLoading) {
    return <SpinnerLoading />;
  }

  const renderNotificationsByRole = () => {
    if (!user) {
      return <SpinnerLoading />;
    }

    // Passe le type sélectionné en prop au composant enfant approprié
    const props = { selectedType };

    switch (user.role) {
      case 'admin':
        return <AdminNotifications {...props} />;
      case 'vendeur':
        return <VendeurNotifications {...props} />;
      case 'client':
        return <ClientNotifications {...props} />;
      default:
        return (
          <div className="empty-card">
            <NoDataFound message="Impossible de déterminer votre rôle pour afficher les notifications." />
          </div>
        );
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Notifications</h2>
      {/* Filtrage des notifications pour tous les types de notifications */}
      <div className="actions-notifications">
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          className="filter-select"
          style={{
            fontFamily: 'var(--font-famaily)'
          }}
        >
          <option value="">Tous les types</option>
          {notificationTypes.map(type => (
            <option key={type.id_type_notif} value={type.id_type_notif}>
              {formatLabel(type.libelle)}
            </option>
          ))}
        </select>
      </div>
      {renderNotificationsByRole()}
    </div>
  );
};

export default Notifications;

