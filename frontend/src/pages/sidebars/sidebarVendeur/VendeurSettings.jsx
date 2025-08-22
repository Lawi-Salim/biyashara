import React, { useState, useEffect } from 'react';
import apiService, { getUnitesByCategories } from '../../../apiService';
import SpinnerLoading from '../../../components/SpinnerLoading';
import { useToast } from '../../../context/ToastContext';
import { FiUpload, FiCheck, FiHelpCircle, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import SupportTicketModal from '../../../components/SupportTicketModal';
import CreatePictures from '../../../components/CreatePictures';
import { getImageUrl } from '../../../utils/imageUrl';
import './VendeurSettings.css';

const VendeurSettings = () => {
  const [boutique, setBoutique] = useState(null);
  const [formData, setFormData] = useState({
    nom_boutique: '',
    description: '',
    adresse_boutique: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerUrl, setBannerUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [showBannerGallery, setShowBannerGallery] = useState(false);
  
  // États pour la gestion des catégories
  const [familles, setFamilles] = useState([]);
  const [selectedFamilles, setSelectedFamilles] = useState([]);
  const [initialFamilles, setInitialFamilles] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isCategoriesDirty, setIsCategoriesDirty] = useState(false);
  const [nicheUnites, setNicheUnites] = useState([]);
  const [categoriesVerrouillees, setCategoriesVerrouillees] = useState(false);
  const MAX_FAMILLES = 2;

  // États pour le ticket de support
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supportTicket, setSupportTicket] = useState(null);
  const [ticketLoading, setTicketLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les informations de la boutique
        const { data } = await apiService.get('/boutiques/my-shop');
        setBoutique(data);
        if (data.vendeur) {
          setCategoriesVerrouillees(data.vendeur.categories_verrouillees);
        }
        setFormData({
          nom_boutique: data.nom_boutique || '',
          description: data.description || '',
          adresse_boutique: data.adresse_boutique || '',
        });
        if (data.logo_boutique) setLogoPreview(getImageUrl(data.logo_boutique));
        if (data.banniere_boutique) setBannerPreview(getImageUrl(data.banniere_boutique));
      } catch (err) {
        if (err.response && err.response.data && err.response.data.vendeur) {
          setCategoriesVerrouillees(err.response.data.vendeur.categories_verrouillees);
        }
        if (err.response && err.response.status !== 404) {
          addToast('Erreur lors de la récupération des informations de la boutique.', 'error');
        }
      }

      try {
        // Récupérer les familles de catégories et les préférences
        const [famillesRes, preferencesRes] = await Promise.all([
          apiService.get('/vendeur-categories/familles'),
          apiService.get('/vendeur-categories')
        ]);
        
        setFamilles(famillesRes.data.data);
        
        if (preferencesRes.data.data.famillesPreferees) {
          setSelectedFamilles(preferencesRes.data.data.famillesPreferees.map(f => f.id_categorie));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        addToast('Erreur lors du chargement des catégories.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const fetchTicketStatus = async () => {
      try {
        const { data } = await apiService.get('/support/tickets/status');
        setSupportTicket(data.ticket);
      } catch (error) {
        console.error('Erreur lors de la récupération du statut du ticket', error);
      } finally {
        setTicketLoading(false);
      }
    };

    fetchTicketStatus();
  }, [addToast]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      if (name === 'logo_boutique') {
        setLogoFile(file);
        setLogoPreview(previewUrl);
      } else if (name === 'banniere_boutique') {
        setBannerFile(file);
        setBannerPreview(previewUrl);
        setBannerUrl(''); // Réinitialiser l'URL si un fichier est choisi
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setIsDirty(true);
  };


  const handleBannerSelect = (imageUrl) => {
    setShowBannerGallery(false);
    setBannerPreview(imageUrl);
    setBannerUrl(imageUrl); // Stocker l'URL de la galerie
    setBannerFile(null); // S'assurer qu'aucun fichier n'est sélectionné
    setIsDirty(true);
  };

  // Gestion des catégories
  const toggleFamille = (familleId) => {
    setSelectedFamilles(prev => {
      const isCurrentlySelected = prev.includes(familleId);
      if (!isCurrentlySelected && prev.length >= MAX_FAMILLES) {
        addToast(`Vous ne pouvez sélectionner que ${MAX_FAMILLES} familles de produits au maximum.`, 'warning');
        return prev; // Empêche la sélection
      }

      const newSelection = isCurrentlySelected
        ? prev.filter(id => id !== familleId)
        : [...prev, familleId];
      
      // Vérifier si la sélection a changé par rapport à l'état initial
      const sortedNew = [...newSelection].sort();
      const sortedInitial = [...initialFamilles].sort();
      setIsCategoriesDirty(JSON.stringify(sortedNew) !== JSON.stringify(sortedInitial));
      
      return newSelection;
    });
  };

  const handleSaveCategories = async () => {
    setLoadingCategories(true);
    try {
      await apiService.put('/vendeur-categories', {
        categoriesIds: selectedFamilles
      });
      setInitialFamilles([...selectedFamilles]);
      setIsCategoriesDirty(false);
      // Après la sauvegarde, récupérer les unités correspondantes
      if (selectedFamilles.length > 0) {
        try {
          const response = await getUnitesByCategories(selectedFamilles);
          setNicheUnites(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des unités de la niche :', error);
          addToast('Impossible de charger les unités pour les catégories sélectionnées.', 'error');
        }
      } else {
        setNicheUnites([]); // Vider la liste si aucune catégorie n'est sélectionnée
      }
      addToast('Préférences catégories mises à jour et verrouillées avec succès !', 'success');
      setCategoriesVerrouillees(true); // Verrouiller l'UI immédiatement
    } catch (err) {
      addToast(err.response?.data?.message || 'Erreur lors de la mise à jour des catégories.', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmitTicket = async (raison) => {
    setSubmitLoading(true);
    try {
      const { data } = await apiService.post('/support/tickets', { raison });
      setSupportTicket(data.ticket);
      addToast('Votre demande a été envoyée avec succès.', 'success');
      setIsModalOpen(false);
    } catch (err) {
      addToast(err.response?.data?.message || "Erreur lors de l'envoi de la demande.", 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = new FormData();
    submissionData.append('nom_boutique', formData.nom_boutique);
    submissionData.append('description', formData.description);
    submissionData.append('adresse_boutique', formData.adresse_boutique);
    if (logoFile) {
      submissionData.append('logo_boutique', logoFile);
    }
    if (bannerFile) {
      submissionData.append('banniere_boutique', bannerFile);
    } else if (bannerUrl) {
      submissionData.append('banniere_boutique_url', bannerUrl);
    }

    try {
      const { data } = await apiService.post('/boutiques/my-shop', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setBoutique(data);
      addToast('Boutique mise à jour avec succès !', 'success');
      setIsDirty(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !boutique) {
    return <SpinnerLoading />;
  }

  return (
    <div className="vendeur-settings-boutique">
      <h4>{boutique ? 'Gérer ma boutique' : 'Créer ma boutique'}</h4>
      <form onSubmit={handleSubmit} className="boutique-form">
        <div className="form-group">
          <label htmlFor="nom_boutique">Nom de la boutique</label>
          <input
            type="text"
            id="nom_boutique"
            name="nom_boutique"
            value={formData.nom_boutique}
            onChange={handleChange}
            className="dashboard-select"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="dashboard-select"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="adresse_boutique">Adresse</label>
          <input
            type="text"
            id="adresse_boutique"
            name="adresse_boutique"
            value={formData.adresse_boutique}
            onChange={handleChange}
            className="dashboard-select"
            required
          />
        </div>

        <div className="form-group">
          <label>Logo (300x300)</label>
          <div className="image-upload-box" onClick={() => document.getElementById('logo-upload').click()}>
            {logoPreview ? (
              <img src={logoPreview} alt="Aperçu du logo" className="image-preview" />
            ) : (
              <div className="upload-placeholder">
                <FiUpload size={24} />
                <span>Cliquez pour choisir un logo</span>
              </div>
            )}
          </div>
          <input id="logo-upload" type="file" name="logo_boutique" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
        </div>

        <div className="form-group">
          <div className="form-group-header">
            <label>Bannière (1200x400)</label>
            <span className="gallery-link" onClick={() => setShowBannerGallery(true)}>
              Choisir dans la galerie
            </span>
          </div>
          <div className="image-upload-box" onClick={() => document.getElementById('banner-upload').click()}>
            {bannerPreview ? (
              <img src={bannerPreview} alt="Aperçu de la bannière" className="image-preview banner-preview" />
            ) : (
              <div className="upload-placeholder">
                <FiUpload size={24} />
                <span>Cliquez pour choisir une bannière</span>
              </div>
            )}
          </div>
          <input id="banner-upload" type="file" name="banniere_boutique" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
        </div>

        {showBannerGallery && (
          <CreatePictures 
            onSelect={handleBannerSelect}
            onClose={() => setShowBannerGallery(false)}
          />
        )}

        <button type="submit" className="btn btn-primary" disabled={loading || !isDirty}>
          {loading ? 'Enregistrement...' : (boutique ? 'Mettre à jour' : 'Créer la boutique')}
        </button>
      </form>

      {/* Section Catégories de produits */}
      <div className="categories-section" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
        <h5 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Vos catégories de produits</h5>

        {categoriesVerrouillees ? (
          <div className="locked-categories-info">
            {ticketLoading ? (
              <p>Chargement du statut de la demande...</p>
            ) : supportTicket ? (
              <div className={`ticket ticket-status-box status-${supportTicket.status}`}>
                <div className="ticket-status-icon">
                  {supportTicket.status === 'ouvert' && <FiClock />}
                  {supportTicket.status === 'accepté' && <FiCheckCircle />}
                  {supportTicket.status === 'refusé' && <FiXCircle />}
                </div>
                <div className="ticket-status-content">
                  <h6>Statut de votre dernière demande</h6>
                  <p>
                    Votre demande du {new Date(supportTicket.createdAt).toLocaleDateString()} est <strong>{supportTicket.status}</strong>.
                    {supportTicket.status === 'ouvert' && ' Elle est en cours de traitement par nos équipes.'}
                    {supportTicket.status === 'accepté' && ' Vos catégories ont été déverrouillées. Vous pouvez les modifier à nouveau (une seule fois).'}
                    {supportTicket.status === 'refusé' && ' Malheureusement, votre demande n\'a pas pu être acceptée pour le moment.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="request-change-box">
                <p>Vos familles de produits sont verrouillées. Pour demander une modification, veuillez soumettre une demande justifiée.</p>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(true)}>
                  <FiHelpCircle size={18} /> Demander une modification
                </button>
              </div>
            )}
            <div className="families-grid" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {familles.filter(f => selectedFamilles.includes(f.id_categorie)).map(famille => (
                <div key={famille.id_categorie} className="family-checkbox disabled locked">
                  <FiCheck size={16} color="var(--primary-color)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500' }}>{famille.nom}</div>
                  </div>
                </div>
              ))}
            </div>
            <SupportTicketModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleSubmitTicket}
              loading={submitLoading}
            />
          </div>
        ) : (
          <>
            <p style={{ marginBottom: '1.5rem', color: 'var(--warning-color)', fontSize: '0.9rem', border: '1px solid var(--warning-color-light)', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--warning-color-bg)' }}>
              ⚠️ Choisissez vos familles de produits avec soin. Ce choix est définitif. Maximum 2 familles autorisées.
            </p>
            
            <div className="families-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {familles.map(famille => {
                const isSelected = selectedFamilles.includes(famille.id_categorie);
                const isDisabled = !isSelected && selectedFamilles.length >= MAX_FAMILLES;
                return (
                <label 
                  key={famille.id_categorie} 
                  className={`family-checkbox ${isDisabled ? 'disabled' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: selectedFamilles.includes(famille.id_categorie) ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    backgroundColor: selectedFamilles.includes(famille.id_categorie) ? 'var(--primary-color-light)' : 'var(--bg-primary)',
                    transition: 'all 0.2s ease',
                    opacity: isDisabled ? 0.6 : 1
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => toggleFamille(famille.id_categorie)}
                    disabled={isDisabled}
                    style={{ marginTop: '2px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {famille.nom}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {famille.sousCategories?.length || 0} sous-catégories
                    </div>
                    {famille.sousCategories && famille.sousCategories.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                        {famille.sousCategories.slice(0, 3).map(sc => sc.nom).join(', ')}
                        {famille.sousCategories.length > 3 && '...'}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <FiCheck size={16} color="var(--primary-color)" />
                  )}
                </label>
              )})}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {selectedFamilles.length === 0 ? 'Aucune famille sélectionnée' : 
                 `${selectedFamilles.length} / ${MAX_FAMILLES} famille(s) sélectionnée(s)`}
              </div>
              <button 
                type="button"
                onClick={handleSaveCategories}
                disabled={loadingCategories || !isCategoriesDirty}
                className={`btn btn-primary ${!isCategoriesDirty ? 'btn-disabled' : ''}`}
                style={{ minWidth: '120px' }}
              >
                {loadingCategories ? 'Validation...' : 'Valider'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Section Unités de la niche */}
      {nicheUnites.length > 0 && (
        <div className="unites-section" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <h5 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Unités de vente pour votre niche</h5>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Voici les unités de vente qui seront disponibles lors de la création de produits dans les catégories que vous avez sélectionnées.
          </p>
          <div className="unites-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {nicheUnites.map(unite => (
              <span key={unite.id_unite} className="unite-badge" style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                {unite.nom} ({unite.symbole})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendeurSettings;


