import React from 'react';
import { FiInbox } from 'react-icons/fi';
import './NoDataFound.css';

const NoDataFound = ({ message, ctaText, onCtaClick }) => {
  return (
    <div className="no-data-container">
      <div className="no-data-icon">
        <FiInbox size={48} />
      </div>
      <p className="no-data-message">{message || 'Aucune donnée trouvée pour le moment.'}</p>
      {ctaText && onCtaClick && (
        <button className="no-data-cta" onClick={onCtaClick}>
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default NoDataFound;
