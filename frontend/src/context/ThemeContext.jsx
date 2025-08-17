import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext(undefined);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        root.classList.toggle('dark', mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
