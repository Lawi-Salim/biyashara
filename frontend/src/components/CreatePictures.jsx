import React from 'react';
import './CreatePictures.css';

// Générer 15 graines uniques pour les bannières
const bannerSeeds = Array.from({ length: 15 }, (_, i) => `banner-${i}-biyashara`);

const CreatePictures = ({ onSelect, onClose }) => {
    return (
        <div className="banner-gallery-modal">
            <div className="banner-gallery-content">
                <div className="banner-gallery-header">
                    <h2>Choisissez une bannière</h2>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>
                <div className="banner-gallery-grid">
                    {bannerSeeds.map((seed, index) => {
                        const imageUrl = `${process.env.REACT_APP_API_URL}/banners/${seed}.png`;
                        return (
                            <div 
                                key={index} 
                                className="banner-thumbnail" 
                                onClick={() => onSelect(imageUrl)} // On passe l'URL complète
                                title={`Sélectionner ${seed}`}
                            >
                                <div 
                                    className="banner-pattern"
                                    style={{ backgroundImage: `url(${imageUrl})` }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CreatePictures;