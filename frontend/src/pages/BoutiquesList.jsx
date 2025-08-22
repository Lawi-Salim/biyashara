import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../apiService';
import SpinnerLoading from '../components/SpinnerLoading';
import NoDataFound from '../components/common/NoDataFound';
import ErrorDataFound from '../components/common/ErrorDataFound';
import { getImageUrl } from '../utils/imageUrl';
import { FaStar, FaEye } from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';
import './BoutiquesList.css';

const BoutiquesList = () => {
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoutiques = async () => {
      try {
        const { data } = await apiService.get('/boutiques');
        setBoutiques(data);
      } catch (err) {
        setError('Impossible de charger la liste des boutiques.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoutiques();
  }, []);

  if (loading) {
    return <SpinnerLoading />;
  }

  if (error) {
    return <ErrorDataFound message={error} />;
  }

  return (
    <div className="boutiques-list-container">
      <h1>Découvrez nos boutiques</h1>
      {boutiques.length === 0 ? (
        <div className="card-empty">
          <NoDataFound message="Aucune boutique n'est disponible pour le moment." />
        </div>
      ) : (
        <div className="boutiques-grid">
          {boutiques.map((boutique) => (
            <Link to={`/boutiques/${boutique.slug}`} key={boutique.id_boutique} className="boutique-card">
              <div className="boutique-card-banner">
                <img src={getImageUrl(boutique.banniere_boutique)} alt={`Bannière de ${boutique.nom_boutique}`} />
              </div>
              <div className="boutique-card-content">
                <div className="boutique-card-logo">
                  <img src={getImageUrl(boutique.logo_boutique)} alt={`Logo de ${boutique.nom_boutique}`} />
                </div>
                <h3>{boutique.nom_boutique}</h3>
                {boutique.vendeur?.categoriesPreferees && boutique.vendeur.categoriesPreferees.length > 0 && (
                  <p className="boutique-card-category">
                    Catégorie : {boutique.vendeur.categoriesPreferees.map(cat => cat.nom).join(', ')}
                  </p>
                )}
                <div className="boutique-card-rating">
                  {boutique.review_count > 0 ? (
                    <>
                      <FaStar color="#ffc107" />
                      <span>{parseFloat(boutique.avg_rating || 0).toFixed(1)}</span>
                      <span className="review-count">({boutique.review_count} avis)</span>
                    </>
                  ) : (
                    <span className="no-rating">Note : <FaStar color="#ffc107" style={{ paddingTop: '2px' }} size={13} /> 0 (0 avis)</span>
                  )}
                </div>
                <div className="boutique-card-products">
                  <span>Articles : {boutique.product_count || 0} </span>
                </div>
                <div className="boutique-card-visit">
                  <span>Visite : <FaEye color='#fff' style={{ paddingTop: '2px' }} size={13}/> 123</span>
                </div>
                <div className="boutique-card-footer">
                  <span className="boutique-card-button">Voir la boutique</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoutiquesList;
