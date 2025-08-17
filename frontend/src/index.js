import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Création de la racine de l'application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendu de l'application avec le routeur
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);