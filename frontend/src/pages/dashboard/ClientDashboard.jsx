import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import NoDataFound from '../../components/common/NoDataFound';
import './Dashboard.css';

const ClientDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {location.pathname === '/client/dashboard' ? (
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1>Mon Compte</h1>
          </header>

          <div className="dashboard-card">
            <h2>Historique de vos commandes</h2>
            <NoDataFound message="Vous n'avez aucune commande pour le moment." />
            {/* La liste des commandes ira ici */}
          </div>

          <div className="dashboard-card">
            <h2>Mes Informations</h2>
            <NoDataFound message="Vos informations personnelles apparaîtront ici." />
            {/* Le formulaire d'informations personnelles ira ici */}
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </DashboardLayout>
  );
};

export default ClientDashboard;
