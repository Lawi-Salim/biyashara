import React, { useState, useEffect } from 'react';
import apiService from '../../../apiService';
import NoDataFound from '../../../components/common/NoDataFound';
import SpinnerLoading from '../../../components/SpinnerLoading';
import './styleAdmin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // const data = await apiService.get('/users');
        // setUsers(data);
        setUsers([]); // TODO: Remplacer par les données de l'API
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <h2 className="admin-title">Gestion des Utilisateurs</h2>
      {loading ? (
        <div className="empty-card">
          <div className="loading-container">
            <SpinnerLoading size="large" color='var(--primary-500)' />
            <p>Chargement des utilisateurs...</p>
          </div>
        </div>
      ) : users.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="btn-edit">Modifier</button>
                  <button className="btn-delete">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-card">
          <NoDataFound message="Aucun utilisateur à afficher pour le moment." />
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
