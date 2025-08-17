// Modal centralisé dans toute l'appli 
import React from 'react';

const SpinnerLoading = ({ size = 'medium', color = 'var(--primary-600)' }) => {
    const sizes = {
        small: '20px',
        medium: '36px',
        large: '60px',
    };

    const spinnerStyle = {
        border: `5px solid ${color === '#fff' ? 'var(--primary-300)' : 'var(--primary-600)'}`,
        width: sizes[size] || sizes.medium,
        height: sizes[size] || sizes.medium,
        borderRadius: '50%',
        borderTopColor: color,
        animation: 'spin 1s ease-in-out infinite',
    };

    // The container no longer needs padding or specific flex properties
    // as it will be placed absolutely within the button.
    return (
        <div>
            <style>
                {`@keyframes spin { to { transform: rotate(360deg); } }`}
            </style>
            <div style={spinnerStyle}></div>
        </div>
    );
};

export default SpinnerLoading;