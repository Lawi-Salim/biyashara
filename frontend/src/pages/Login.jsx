import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SpinnerLoading from '../components/SpinnerLoading';
import Modal from '../components/Modal';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(formData.email, formData.password, rememberMe);
      setShowRedirectModal(true);

      setTimeout(() => {
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (userData.role === 'vendeur') {
          navigate('/vendeur/dashboard');
        } else {
          navigate('/client/dashboard');
        }
      }, 2000);

    } catch (err) {
      addToast(err.response?.data?.message || 'Une erreur s\'est produite.', 'error');
    }
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={showRedirectModal}>
        <SpinnerLoading size="large" color='var(--primary-50)' />
        <p>Connexion réussie ! Redirection en cours...</p>
      </Modal>

      <div className="auth-page-container">
        {/* Showcase Section */}
        <div className="auth-showcase">
          <div className="auth-showcase-logo">
            <img src="/favicon-black.png" alt="Biyashara Logo" />
            <h1>Biyashara</h1>
          </div>
          <p>Heureux de vous revoir ! Connectez-vous pour accéder à votre compte et continuer votre expérience d'achat.</p>
        </div>

        {/* Form Section */}
        <div className="auth-form-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <Link to="/" className="back-to-home"><FiArrowLeft /> Accueil</Link>
            <div className="auth-header">
              <h2>Connexion</h2>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
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

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                Se souvenir de moi
              </label>
              <Link to="/forgot-password">Mot de passe oublié ?</Link>
            </div>

            <button type="submit" className={`auth-button ${loading ? 'loading' : ''}`} disabled={loading}>
              <span className="button-text">Se connecter</span>
              <div className="spinner-container">
                <SpinnerLoading size="small" color="#fff" />
              </div>
            </button>

            <div className="auth-switch">
              <p>Vous n'avez pas de compte ? <Link to="/register">Inscrivez-vous</Link></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;