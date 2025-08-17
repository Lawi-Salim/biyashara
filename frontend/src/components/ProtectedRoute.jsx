import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole, outlet }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Vous pouvez afficher un spinner de chargement ici
    return <div>Chargement...</div>;
  }

  if (!user) {
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Si un rôle est requis mais que l'utilisateur n'a pas le bon rôle,
    // rediriger vers une page par défaut (ou une page "Non autorisé")
    return <Navigate to="/" />;
  }

  // Si l'utilisateur est connecté et a le bon rôle (si requis),
  // afficher le contenu de la route protégée
  return outlet ? outlet : <Outlet />;
};

export default ProtectedRoute;
