import React, { useState, useEffect } from 'react';
import apiService, { getUnitesByCategories } from '../../../apiService';
import NoDataFound from '../../../components/common/NoDataFound';
import ErrorDataFound from '../../../components/common/ErrorDataFound';
import SpinnerLoading from '../../../components/SpinnerLoading';
import Modal from '../../../components/Modal';
import { FiUpload } from 'react-icons/fi';
import { getImageUrl } from '../../../utils/FileUtils';
import { useToast } from '../../../context/ToastContext';
import './styleVendeur.css';

const VendeurProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [unites, setUnites] = useState([]);
  const [filteredUnites, setFilteredUnites] = useState([]);
  const [newProduct, setNewProduct] = useState({
    nom: '',
    description: '',
    prix_unite: '',
    quantite_stock: '',
    id_categorie: '',
    id_unite: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategoriesAndUnites();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiService.get('/produits/vendeur');
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de vos produits:', error);
      setError('Impossible de charger vos produits.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndUnites = async () => {
    // Cette fonction charge désormais les catégories de la niche
    // et la liste complète des unités comme fallback, mais le filtrage
    // se fait dynamiquement via le useEffect.

    try {
      // Récupérer les catégories filtrées selon les préférences du vendeur
      const response = await apiService.get('/vendeur-categories');
      const data = response.data.data;
      
      // Si le vendeur a des préférences, utiliser les sous-catégories filtrées
      // Sinon, récupérer toutes les sous-catégories
      if (data.sousCategories && data.sousCategories.length > 0) {
        setCategories(data.sousCategories);
        // Pré-sélectionner la première catégorie de la niche
        setNewProduct(prev => ({ ...prev, id_categorie: data.sousCategories[0].id_categorie }));
      } else {
        // Fallback: récupérer toutes les sous-catégories (niveau 2)
        const allCategoriesResponse = await apiService.get('/categories');
        const sousCategories = allCategoriesResponse.data.filter(cat => cat.niveau === 2);
        setCategories(sousCategories);
        // Ne rien faire ici pour les unités, le filtrage est maintenant dynamique
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories et unités:', error);
      // Fallback en cas d'erreur sur les catégories
      try {
        const response = await apiService.get('/categories');
        const sousCategories = response.data.filter(cat => cat.niveau === 2);
        setCategories(sousCategories);
      } catch (fallbackError) {
        console.error('Erreur fallback catégories/unités:', fallbackError);
      }
    }
  };

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });

    if (name === 'id_categorie') {
      // Réinitialiser l'unité lorsque la catégorie change
      setNewProduct(prev => ({ ...prev, id_unite: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  // Nettoyer l'URL de l'aperçu pour éviter les fuites de mémoire
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Mettre à jour les unités filtrées lorsque la catégorie sélectionnée change
  useEffect(() => {
    const updateFilteredUnites = async () => {
      if (newProduct.id_categorie) {
        try {
          const response = await getUnitesByCategories([newProduct.id_categorie]);
          const unitesData = response.data;
          setFilteredUnites(unitesData);
          // Pré-sélectionner la première unité si la liste n'est pas vide
          if (unitesData.length > 0) {
            setNewProduct(prev => ({ ...prev, id_unite: unitesData[0].id_unite }));
          }
        } catch (error) {
          console.error('Erreur lors du filtrage des unités:', error);
          setFilteredUnites([]); // Vider en cas d'erreur
        }
      } else {
        setFilteredUnites([]); // Aucune catégorie sélectionnée, aucune unité à montrer
      }
    };

    updateFilteredUnites();
  }, [newProduct.id_categorie]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(newProduct).forEach(key => {
      formData.append(key, newProduct[key]);
    });

    try {
      await apiService.post('/produits', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsModalOpen(false);
      fetchProducts(); // Recharger la liste des produits
      addToast('Produit ajouté avec succès!', 'success');
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      addToast('Erreur lors de l`ajout du produit.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product) => {
    // Pré-remplir le formulaire d'édition avec les données du produit, y compris la quantité de stock
    setEditingProduct({
      ...product,
      quantite_stock: product.stock ? product.stock.quantite : 0
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiService.put(`/produits/${editingProduct.id_produit}`, editingProduct);
      setIsEditModalOpen(false);
      fetchProducts(); // Recharger la liste
      addToast('Produit mis à jour avec succès!', 'success');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      addToast('Erreur lors de la mise à jour du produit.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="vendeur-container">
       <div className="vendeur-header">
        <h2 className="vendeur-title">Mes Produits</h2>
        <button className="btn-add-product" onClick={() => setIsModalOpen(true)}>Ajouter un produit</button>
      </div>
      {loading ? (
        <div className="empty-card">
          <div className="loading-container">
            <SpinnerLoading size="large" color='var(--primary-500)' />
            <p>Chargement des produits...</p>
          </div>
        </div>
      ) : error ? (
        <div className="empty-card">
          <ErrorDataFound message={error} />
        </div>
      ) : products.length > 0 ? (
        <table className="vendeur-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id_produit}>
                <td>{product.id_produit}</td>
                <td><img src={getImageUrl(product.image)} alt={product.nom} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} /></td>
                <td>{product.nom}</td>
                <td>{categories.find(cat => cat.id_categorie === product.id_categorie)?.nom || 'N/A'}</td> 
                <td>{product.prix_unite}€</td>
                <td>{product.stock ? product.stock.quantite : 'N/A'}</td>
                <td>{/* Statut à déterminer */}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditClick(product)}>Modifier</button>
                  <button className="btn-delete">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-card">
          <NoDataFound 
            message="Vous n'avez aucun produit pour le moment."
            ctaText="Ajouter un produit"
            onCtaClick={() => setIsModalOpen(true)}
          />
        </div>
      )}
    </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un nouveau produit">
        <form onSubmit={handleSubmit} className="product-form">
          <h2>Ajouter un produit</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nom">Nom du produit</label>
              <input type="text" id="nom" name="nom" value={newProduct.nom} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="prix_unite">Prix</label>
              <input type="number" id="prix_unite" name="prix_unite" value={newProduct.prix_unite} onChange={handleInputChange} required min="0" step="0.01" />
            </div>
            <div className="form-group span-2">
              <label htmlFor="quantite_stock">Stock Initial</label>
              <input type="number" id="quantite_stock" name="quantite_stock" value={newProduct.quantite_stock} onChange={handleInputChange} required min="0" />
            </div>
            <div className="form-group span-2">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={newProduct.description} onChange={handleInputChange}></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="id_categorie">Catégorie</label>
              <select id="id_categorie" name="id_categorie" value={newProduct.id_categorie} onChange={handleInputChange} className='filter-select' style={{ fontFamily: 'var(--font-family)' }} required>
                {categories.map(cat => (
                  <option key={cat.id_categorie} value={cat.id_categorie}>{cat.nom}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="id_unite">Unité de mesure</label>
              <select id="id_unite" name="id_unite" value={newProduct.id_unite} onChange={handleInputChange} className='filter-select' style={{ fontFamily: 'var(--font-family)' }} required>
                  {filteredUnites.map(unite => (
                    <option key={unite.id_unite} value={unite.id_unite}>{unite.nom} ({unite.symbole})</option>
                  ))}
              </select>
            </div>
            <div className="form-group span-2">
              {/* Upload d'image avec aperçu */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                  Image du produit
                </label>
                <div style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: imagePreview ? 'var(--bg-secondary)' : 'var(--bg-primary)'
                }} onClick={() => document.getElementById('image-upload').click()}>
                  {imagePreview ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        style={{
                          maxWidth: '120px',
                          maxHeight: '120px',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Cliquez pour changer l'image
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <FiUpload size={24} color="var(--text-secondary)" />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Cliquez pour sélectionner une image
                      </span>
                    </div>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Annuler</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal d'édition */}
      {editingProduct && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modifier le produit">
          <form onSubmit={handleUpdateSubmit} className="product-form">
            <h2>Modifier le produit</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="edit-nom">Nom du produit</label>
                <input type="text" id="edit-nom" name="nom" value={editingProduct.nom} onChange={handleEditInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="edit-prix_unite">Prix</label>
                <input type="number" id="edit-prix_unite" name="prix_unite" value={editingProduct.prix_unite} onChange={handleEditInputChange} required min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label htmlFor="edit-quantite_stock">Stock</label>
                <input type="number" id="edit-quantite_stock" name="quantite_stock" value={editingProduct.quantite_stock} onChange={handleEditInputChange} required min="0" />
              </div>
              <div className="form-group span-2">
                <label htmlFor="edit-description">Description</label>
                <textarea id="edit-description" name="description" value={editingProduct.description} onChange={handleEditInputChange}></textarea>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Annuler</button>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default VendeurProducts;
