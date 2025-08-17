import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenue sur Biyashara</h1>
          <p>La marketplace qui connecte vendeurs et acheteurs en toute simplicité</p>
          <div className="hero-buttons">
            <Link to="/seller/register" className="btn-primary-large">Commencer à vendre</Link>
            <button className="btn-secondary-large">Explorer les produits</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Pourquoi choisir Biyashara ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛍️</div>
              <h3>Pour les Acheteurs</h3>
              <p>Découvrez une large gamme de produits de qualité avec un système de recherche avancé</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏪</div>
              <h3>Pour les Vendeurs</h3>
              <p>Créez votre boutique en ligne et gérez vos produits avec nos outils intuitifs</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Sécurisé</h3>
              <p>Transactions sécurisées et protection des données garantie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Catégories Populaires</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-image">📱</div>
              <h3>Électronique</h3>
            </div>
            <div className="category-card">
              <div className="category-image">👕</div>
              <h3>Mode</h3>
            </div>
            <div className="category-card">
              <div className="category-image">🏠</div>
              <h3>Maison</h3>
            </div>
            <div className="category-card">
              <div className="category-image">📚</div>
              <h3>Livres</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;