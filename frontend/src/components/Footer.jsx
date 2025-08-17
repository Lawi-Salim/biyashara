import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaDesktop } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const { theme, setTheme } = useTheme();
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <div className="footer-brand">
            <img src="/favicon.png" alt="Biyashara Logo" className="footer-logo" />
            <h3>Biyashara</h3>
          </div>
          <p>La marketplace qui connecte vendeurs et acheteurs en toute simplicité.</p>
          <div className="social-links">
            <button type="button" aria-label="Facebook">📘</button>
            <button type="button" aria-label="Twitter">🐦</button>
            <button type="button" aria-label="Instagram">📷</button>
            <button type="button" aria-label="LinkedIn">💼</button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Liens Rapides</h4>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/products">Produits</a></li>
            <li><a href="/categories">Catégories</a></li>
            <li><a href="/about">À propos</a></li>
          </ul>
        </div>

        {/* For Sellers */}
        <div className="footer-section">
          <h4>Pour les Vendeurs</h4>
          <ul>
            <li><Link to="/seller/register">Devenir vendeur</Link></li>
            <li><a href="/seller/dashboard">Tableau de bord</a></li>
            <li><a href="/seller/help">Aide vendeur</a></li>
            <li><a href="/seller/fees">Tarifs</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/help">Centre d'aide</a></li>
            <li><a href="/contact">Nous contacter</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/terms">Conditions d'utilisation</a></li>
          </ul>
        </div>

        {/* Theme Switcher */}
        <div className="footer-theme">
          <p className="name">Thème :</p>
          <div className="mode">
            <div className={`mode-system ${theme === 'system' ? 'active' : ''}`} title='Mode Système' onClick={() => setTheme('system')}>
              <FaDesktop />
            </div>
            <div className={`mode-light ${theme === 'light' ? 'active' : ''}`} title='Mode Clair' onClick={() => setTheme('light')}>
              <FiSun />
            </div>
            <div className={`mode-dark ${theme === 'dark' ? 'active' : ''}`} title='Mode Sombre' onClick={() => setTheme('dark')}>
              <FiMoon />
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-copyright">
            <p>&copy; 2024 Biyashara. Tous droits réservés.</p>
            <div className="footer-legal">
              <a href="/privacy">Politique de confidentialité</a>
              <span>•</span>
              <a href="/terms">Conditions générales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;