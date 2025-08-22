import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import apiService from '../../apiService';
import AdminSettings from '../sidebars/sidebarAdmin/AdminSettings';
import VendeurSettings from '../sidebars/sidebarVendeur/VendeurSettings';
import ClientSettings from '../sidebars/sidebarClient/ClientSettings';
import UserAvatar from './UserAvatar';
import Modal from '../../components/Modal';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    nom: '',
    telephone: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [initialForm, setInitialForm] = useState({
    nom: '',
    telephone: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = {
        nom: user.nom || '',
        telephone: user.telephone || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      setForm(userData);
      setInitialForm(userData);
      setInitialized(true);
    }
  }, [user]);

  const RoleSettings = useMemo(() => {
    if (!user) return null;
    if (user.role === 'admin') return <AdminSettings />;
    if (user.role === 'vendeur') return <VendeurSettings />;
    if (user.role === 'client') return <ClientSettings />;
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Détection de modification (dirty)
  const isDirty = useMemo(() => {
    if (!initialized) return false;
    const keys = ['nom', 'telephone', 'email', 'currentPassword', 'newPassword', 'confirmPassword'];
    return keys.some((k) => (form[k] || '') !== (initialForm[k] || ''));
  }, [form, initialForm, initialized]);

  // Ouverture du modal de confirmation
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  // Sauvegarde effective après confirmation
  const performSave = async () => {
    setLoading(true);
    try {
      const payload = {};
      ['nom', 'telephone', 'email', 'currentPassword', 'newPassword', 'confirmPassword']
        .forEach((key) => {
          if (form[key] && form[key] !== '') payload[key] = form[key];
        });

      const { data } = await apiService.put('/auth/me', payload);

      // Mettre à jour le user stocké (token inchangé)
      const updatedUser = data.user;
      try {
        const hasTokenInLocal = !!localStorage.getItem('token');
        const target = hasTokenInLocal ? localStorage : sessionStorage;
        target.setItem('user', JSON.stringify(updatedUser));
      } catch {}

      addToast(data.message || 'Profil mis à jour avec succès', 'success');
      // Réinitialiser les champs sensibles et l'état initial
      const nextForm = { ...form, currentPassword: '', newPassword: '', confirmPassword: '' };
      setForm(nextForm);
      setInitialForm(nextForm);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Une erreur est survenue';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container dashboard-settings">
      <div className="dashboard-setting-avatar">
        <UserAvatar name={user?.nom} size={84} />
        <strong>{user?.nom}</strong>
      </div>
      <div className="dashboard-setting-content">
        <div className="dashboard-header">
          <h1>Paramètres</h1>
        </div>

        <div className="dashboard-card">
          <h2>Mon compte</h2>
          <form onSubmit={handleSubmit}>
            <div className="settings-form-grid">
              {/* Ligne 1: Nom | Téléphone */}
              <div className="settings-field">
                <label>Nom</label>
                <input name="nom" value={form.nom} onChange={handleChange} className="dashboard-select" />
              </div>
              <div className="settings-field">
                <label>Téléphone</label>
                <input name="telephone" value={form.telephone} onChange={handleChange} className="dashboard-select" />
              </div>

              {/* Ligne 2: Email | Mot de passe actuel */}
              <div className="settings-field">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="dashboard-select" />
              </div>
              <div className="settings-field">
                <label>Mot de passe actuel</label>
                <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} className="dashboard-select" />
              </div>

              {/* Ligne 3: Nouveau mot de passe | Confirmer */}
              <div className="settings-field">
                <label>Nouveau mot de passe</label>
                <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} className="dashboard-select" />
              </div>
              <div className="settings-field">
                <label>Confirmer le nouveau mot de passe</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="dashboard-select" />
              </div>
            </div>
            <div className="settings-actions">
              <button type="submit" className="btn btn-primary" disabled={loading || !isDirty}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>

        <div className="dashboard-card">
          <h2>Options supplémentaires</h2>
          {RoleSettings}
        </div>
      </div>

      {/* Modal de confirmation */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)}>
        <div className="settings-confirm-modal">
          <h3>Confirmer les modifications</h3>
          <p>Voulez-vous enregistrer ces changements de profil ?</p>
          <div className="settings-confirm-actions">
            <button className="btn btn-danger" onClick={() => setShowConfirm(false)}>Annuler</button>
            <button className="btn btn-primary" onClick={() => { setShowConfirm(false); performSave(); }} disabled={loading}>Confirmer</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;


