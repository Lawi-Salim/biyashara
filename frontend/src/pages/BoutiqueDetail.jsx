import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../apiService';
import SpinnerLoading from '../components/SpinnerLoading';
import ErrorDataFound from '../components/common/ErrorDataFound';
import { getImageUrl } from '../utils/imageUrl';
import './BoutiqueDetail.css';

const BoutiqueDetail = () => {
  const { slug } = useParams();
  const [boutique, setBoutique] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoutique = async () => {
      try {
        const response = await apiService.get(`/boutiques/slug/${slug}`);
        setBoutique(response.data);
      } catch (err) {
        setError('Boutique non trouvée ou une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoutique();
  }, [slug]);

  if (loading) {
    return <SpinnerLoading />;
  }

  if (error || !boutique) {
    return <ErrorDataFound message={error || 'Boutique non trouvée.'} />;
  }

  return (
    <div className="boutique-detail-container">
      <header className="boutique-header">
        <img src={getImageUrl(boutique.banniere_boutique) || 'https://via.placeholder.com/1200x300?text=Bannière'} alt={`Bannière de ${boutique.nom_boutique}`} className="boutique-banner" />
        <div className="boutique-header-content">
          <img src={getImageUrl(boutique.logo_boutique) || 'https://via.placeholder.com/150x150?text=Logo'} alt={`Logo de ${boutique.nom_boutique}`} className="boutique-logo" />
          <div className="boutique-info">
            <h1>{boutique.nom_boutique}</h1>
            <p>{boutique.adresse_boutique}</p>
          </div>
        </div>
      </header>

      <main className="boutique-main-content">

        <section className="boutique-products">
          <h2>Nos produits</h2>
          {boutique.produits && boutique.produits.length > 0 ? (
            <div className="products-grid">
              {boutique.produits.map(produit => (
                <div key={produit.id_produit} className="product-card">
                  <div className="product-image-container">
                    <img src={produit.image} alt={produit.nom} className="product-image" />
                  </div>
                  <div className="product-card-content">
                    <h3>{produit.nom}</h3>
                    <p className="price">{produit.prix_unite} €</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-products-message">Cette boutique n'a pas encore de produits à vendre.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default BoutiqueDetail;
