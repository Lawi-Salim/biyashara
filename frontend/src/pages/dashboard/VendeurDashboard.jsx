import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import NoDataFound from '../../components/common/NoDataFound';
import './Dashboard.css';

const VendeurDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {location.pathname === '/vendeur/dashboard' ? (
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1>Tableau de Bord Vendeur</h1>
          </header>
          
          <div className="dashboard-card">
            <h2>Vos Produits</h2>
            <NoDataFound message="Vous n'avez aucun produit pour le moment." />
            {/* La liste des produits ira ici */}
          </div>

          <div className="dashboard-card">
            <h2>Vos Ventes</h2>
            <NoDataFound message="Vous n'avez aucune vente pour le moment." />
            {/* La liste des commandes ira ici */}
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </DashboardLayout>
  );
};

export default VendeurDashboard;
