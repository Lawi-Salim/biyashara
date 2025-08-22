import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import './ErrorDataFound.css';

const ErrorDataFound = ({ message }) => {
  return (
    <div className="error-data-container">
      <div className="error-data-icon">
        <FiAlertCircle size={48} />
      </div>
      <p className="error-data-message">{message || 'Une erreur est survenue.'}</p>
    </div>
  );
};

export default ErrorDataFound;
