import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../apiService';
import { useToast } from '../context/ToastContext';
import SpinnerLoading from '../components/SpinnerLoading';
import './Auth.css';

const RegisterSeller = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    nom_boutique: '',
    description_boutique: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      addToast('Les mots de passe ne correspondent pas.', 'error');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      await apiService.post('/api/auth/register-seller-request', dataToSend);
      addToast('Demande envoyée ! Vous recevrez une réponse après examen.', 'success');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      addToast(err.response?.data?.message || 'Une erreur s\'est produite.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-showcase">
        <div className="auth-showcase-logo">
          <img src="/favicon-black.png" alt="Biyashara Logo" />
          <h1>Biyashara</h1>
        </div>
        <p>Rejoignez notre place de marché. Vendez vos produits et touchez des milliers de clients.</p>
      </div>

      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-header">
            <h2>Devenir Vendeur</h2>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom">Nom complet</label>
              <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="John Doe" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telephone">Téléphone</label>
              <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+33 6 12 34 56 78" required />
            </div>

            <div className="form-group">
              <label htmlFor="nom_boutique">Nom de la boutique</label>
              <input type="text" id="nom_boutique" name="nom_boutique" value={formData.nom_boutique} onChange={handleChange} placeholder="Ma Super Boutique" required />
            </div>
          </div>

          <div className="form-group form-group-full-width">
            <label htmlFor="description_boutique">Description de la boutique</label>
            <textarea id="description_boutique" name="description_boutique" value={formData.description_boutique} onChange={handleChange} rows="3" placeholder="Décrivez brièvement votre boutique et les produits que vous vendez."></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-wrapper">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <div className="input-wrapper">
                <input type={showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <SpinnerLoading /> : 'Envoyer ma demande'}
          </button>

          <div className="auth-switch">
            <p>Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterSeller;
