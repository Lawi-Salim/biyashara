import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FiSearch, FiShoppingCart, FiMenu } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <img src="/favicon.png" alt="Biyashara Logo" className="navbar-logo" />
          <h2>Biyashara</h2>
        </div>

        {/* Search Bar */}
        <div className={`navbar-search ${isSearchOpen ? 'active' : ''}`}>
          <input 
            type="text" 
            placeholder="Rechercher des produits..." 
            className="search-input"
            // style={{ fontSize: '13px' }}
          />
          <button className="search-btn"> <FiSearch style={{ color: 'var(--gray-400)', fontSize:'var(--icon-size)' }} /> </button>
        </div>

        {/* Navigation Links & Auth for Mobile */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="/" className="navbar-link">Accueil</a>
          <a href="/boutiques" className="navbar-link">Boutiques</a>
          {/* Auth Buttons inside menu */}
          <div className="navbar-auth">
            <Link to="/login" className="btn-login">Connexion</Link>
            <Link to="/register" className="btn-register">S'inscrire</Link>
          </div>
        </div>

        {/* Cart & Mobile Menu Toggle */}
        <div className="navbar-right">
          {/* Search Icon for Mobile */}
          <button className="search-icon-mobile navbar-icon-btn" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <FiSearch style={{ color: 'var(--gray-400)', fontSize: 'var(--icon-size)' }} />
          </button>
          <div className="cart-icon navbar-icon-btn"> 
            <FiShoppingCart style={{ color: 'var(--gray-400)', fontSize: 'var(--icon-size)' }} /> 
          </div>
          <div className="mobile-menu-toggle navbar-icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FiMenu style={{ fontSize: 'var(--icon-size)' }} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;