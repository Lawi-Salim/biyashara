import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // On vérifie d'abord localStorage, puis sessionStorage
      let token = localStorage.getItem('token');
      let storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        token = sessionStorage.getItem('token');
        storedUser = sessionStorage.getItem('user');
      }

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } 
    } catch (error) {
      // En cas d'erreur, on nettoie les deux stockages
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe) => {
    const response = await apiService.post('/api/auth/login', { email, password });
    const { token, user: userData } = response.data;

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', token);
    storage.setItem('user', JSON.stringify(userData));

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    return userData; // Renvoyer les données utilisateur pour la redirection
  };

  const logout = () => {
    // On nettoie les deux stockages au cas où
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    delete apiService.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
