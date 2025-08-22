import React, { useState, useEffect } from 'react';
import apiService from '../../apiService';
import UserAvatar from './UserAvatar';
import './UserProfile.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await apiService.get('/auth/profile');
        setProfile(data);
      } catch (err) {
        setError('Impossible de charger le profil.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="user-profile-modal"><p>Chargement...</p></div>;
  }

  if (error) {
    return <div className="user-profile-modal"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="user-profile-modal">
      <div className="profile-header">
        <UserAvatar name={profile.nom} size={80} />
        <h2>{profile.nom}</h2>
        <p className="profile-role">{profile.role}</p>
      </div>
      <div className="profile-details">
        <div className="detail-item">
          <strong>Email:</strong>
          <span>{profile.email}</span>
        </div>
        <div className="detail-item">
          <strong>Téléphone:</strong>
          <span>{profile.telephone || 'Non renseigné'}</span>
        </div>
        
        {/* Infos spécifiques au client */}
        {profile.role === 'client' && profile.client && (
          <>
            <div className="detail-item">
              <strong>Solde:</strong>
              <span>{profile.client.solde} KMF</span>
            </div>
            <div className="detail-item">
              <strong>Adresse de facturation:</strong>
              <span>{profile.client.adresse_facturation}</span>
            </div>
          </>
        )}

        {/* Infos spécifiques au vendeur */}
        {profile.role === 'vendeur' && profile.vendeur && (
          <>
            <div className="detail-item">
              <strong>Nationalité:</strong>
              <span>{profile.vendeur.nationalite}</span>
            </div>
            <div className="detail-item">
              <strong>Statut Vendeur:</strong>
              <span>{profile.vendeur.statut}</span>
            </div>
            {profile.boutique && (
              <div className="detail-item">
                <strong>Boutique:</strong>
                <span>{profile.boutique.nom_boutique}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
