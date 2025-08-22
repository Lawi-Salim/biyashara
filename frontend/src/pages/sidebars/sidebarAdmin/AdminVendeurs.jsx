import React, { useState, useEffect } from 'react';
import apiService from '../../../apiService';
import { useToast } from '../../../context/ToastContext';
import NoDataFound from '../../../components/common/NoDataFound';
import ErrorDataFound from '../../../components/common/ErrorDataFound';
import SpinnerLoading from '../../../components/SpinnerLoading';
import { FiUnlock, FiLock } from 'react-icons/fi';
import './styleAdmin.css';

const AdminVendeurs = () => {
  const [vendeurs, setVendeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchVendeurs = async () => {
    try {
      const response = await apiService.get('/admin/vendeurs');
      setVendeurs(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des vendeurs:', error);
      setError('Impossible de charger les vendeurs.');
      addToast('Impossible de charger les vendeurs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendeurs();
  }, []);

  const handleUnlock = async (vendeurId) => {
    try {
      await apiService.put(`/admin/vendeurs/${vendeurId}/unlock-categories`);
      addToast('Catégories déverrouillées avec succès !', 'success');
      // Mettre à jour l'état local pour refléter le changement
      setVendeurs(vendeurs.map(v => 
        v.vendeur.id_vendeur === vendeurId 
          ? { ...v, vendeur: { ...v.vendeur, categories_verrouillees: false } } 
          : v
      ));
    } catch (error) {
      console.error('Erreur lors du déverrouillage:', error);
      addToast(error.response?.data?.message || 'Erreur lors du déverrouillage.', 'error');
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Gestion des Vendeurs</h2>
      {loading ? (
        <div className="empty-card">
          <div className="loading-container">
            <SpinnerLoading size="large" color='var(--primary-500)' />
            <p>Chargement des vendeurs...</p>
          </div>
        </div>
      ) : error ? (
        <div className="empty-card">
          <ErrorDataFound message={error} />
        </div>
      ) : vendeurs.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Statut Catégories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendeurs.map(user => (
              <tr key={user.id_user}>
                <td>{user.id_user}</td>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>
                  {user.vendeur.categories_verrouillees ? (
                    <span className="status-locked"><FiLock /> Verrouillé</span>
                  ) : (
                    <span className="status-unlocked"><FiUnlock /> Ouvert</span>
                  )}
                </td>
                <td>
                  {user.vendeur.categories_verrouillees && (
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => handleUnlock(user.vendeur.id_vendeur)}
                    >
                      Déverrouiller
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-card">
          <NoDataFound message="Aucun vendeur à afficher pour le moment." />
        </div>
      )}
    </div>
  );
};

export default AdminVendeurs;
