import React, { useState } from 'react';
import { FiEye, FiEyeOff,FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../apiService';
import { useToast } from '../context/ToastContext';
import SpinnerLoading from '../components/SpinnerLoading';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: ''
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
      await apiService.post('auth/register', dataToSend);
      addToast('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Délai pour afficher le message
    } catch (err) {
      addToast(err.response?.data?.message || 'Une erreur s\'est produite.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-container">
      {/* Showcase Section */}
      <div className="auth-showcase">
        <div className="auth-showcase-logo">
          <img src="/favicon-black.png" alt="Biyashara Logo" />
          <h1>Biyashara</h1>
        </div>
        <p>Rejoignez notre communauté et découvrez des milliers de produits uniques. L'inscription est rapide et facile.</p>
      </div>

      {/* Form Section */}
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
        <Link to="/" className="back-to-home"><FiArrowLeft /> Accueil</Link>
        <div className="auth-header">
            <h2>Créer votre compte</h2>
          </div>

          {loading && <SpinnerLoading />}

          <div className="form-group">
            <label htmlFor="nom">Nom complet</label>
            <div className="input-wrapper">
              <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="John Doe" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="telephone">Téléphone</label>
              <div className="input-wrapper">
                <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+33 6 12 34 56 78" required />
              </div>
            </div>
          </div>

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

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <SpinnerLoading /> : 'Créer mon compte'}
          </button>

          <div className="auth-switch">
            <p>Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;