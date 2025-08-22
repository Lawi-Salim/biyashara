import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiService from '../apiService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const { user } = useAuth();

  const fetchNotificationCount = useCallback(async () => {
    if (!user) {
      setNotificationCount(0);
      return;
    }
    try {
      const { data } = await apiService.get('/notifications/count');
      setNotificationCount(data.count);
    } catch (error) {
      // Ne pas afficher d'erreur 401 (non autorisé) dans la console
      if (error.response?.status !== 401) {
        console.error('Failed to fetch notification count:', error);
      }
      setNotificationCount(0);
    }
  }, [user]);

  useEffect(() => {
    fetchNotificationCount();
  }, [fetchNotificationCount]);

  const value = {
    notificationCount,
    fetchNotificationCount, // Expose function to allow manual refresh
    decrementCount: () => setNotificationCount(prev => Math.max(0, prev - 1))
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
