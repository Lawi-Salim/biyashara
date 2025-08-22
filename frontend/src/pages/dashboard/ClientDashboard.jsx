import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import NoDataFound from '../../components/common/NoDataFound';
import ErrorDataFound from '../../components/common/ErrorDataFound';
import SpinnerLoading from '../../components/SpinnerLoading';
import './Dashboard.css';

const ClientDashboard = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simuler un appel API
        // const data = await apiService.get('/client/dashboard-data');
        // setSomeData(data);
        // Pour l'instant, on simule une fin de chargement sans erreur
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
      {location.pathname === '/client/dashboard' ? (
        loading ? (
          <SpinnerLoading />
        ) : error ? (
          <ErrorDataFound message={error} />
        ) : (
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
        )
      ) : (
        <Outlet />
      )}
    </DashboardLayout>
  );
};

export default ClientDashboard;
