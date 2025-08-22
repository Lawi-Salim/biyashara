import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import NoDataFound from '../../components/common/NoDataFound';
import ErrorDataFound from '../../components/common/ErrorDataFound';
import SpinnerLoading from '../../components/SpinnerLoading';
import './Dashboard.css';

const VendeurDashboard = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simuler un appel API
        // const data = await apiService.get('/vendeur/dashboard-data');
        // setSomeData(data);
        setLoading(false);
      } catch (err) {
        setError('Impossible de charger les données du tableau de bord.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      {location.pathname === '/vendeur/dashboard' ? (
        loading ? (
          <SpinnerLoading />
        ) : error ? (
          <ErrorDataFound message={error} />
        ) : (
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
        )
      ) : (
        <Outlet />
      )}
    </DashboardLayout>
  );
};

export default VendeurDashboard;
