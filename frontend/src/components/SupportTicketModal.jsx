import React, { useState } from 'react';
import './SupportTicketModal.css';

const SupportTicketModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [raison, setRaison] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!raison.trim()) return;
    onSubmit(raison);
    setRaison('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h4>Demande de modification de catégories</h4>
        <p>Veuillez expliquer en détail pourquoi vous souhaitez modifier vos catégories de produits. Une justification claire et précise accélérera le traitement de votre demande.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="raison">Justification de votre demande</label>
            <textarea
              id="raison"
              value={raison}
              onChange={(e) => setRaison(e.target.value)}
              rows="6"
              placeholder="Ex: Je souhaite élargir ma gamme de produits pour inclure des accessoires de mode..."
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !raison.trim()}>
              {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportTicketModal;
