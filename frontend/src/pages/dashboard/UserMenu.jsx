import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import UserAvatar from './UserAvatar';
import './UserMenu.css';
import { FiSun, FiMoon } from 'react-icons/fi';
import { FaDesktop } from 'react-icons/fa';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when clicking outside

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button className="user-menu-trigger" onClick={toggleMenu}>
        <UserAvatar name={user?.nom} size={36} />
        <span className="user-menu-name">{user?.nom}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`user-menu-chevron ${isOpen ? 'open' : ''}`}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="dropdown-header">
            <p className="dropdown-user-name">{user?.role}</p>
            <p className="dropdown-user-email">{user?.email}</p>
          </div>
          <a href="/profil" className="dropdown-item">Mon Profil</a>
          <a href="/settings" className="dropdown-item">Paramètres</a>
          <div className="theme">
            <p className="dropdown-item">Thème</p>
            <div className="mode">
              <div className={`mode-system ${theme === 'system' ? 'active' : ''}`} title='Mode Système' onClick={() => setTheme('system')}>
                <FaDesktop />
              </div>
              <div className={`mode-light ${theme === 'light' ? 'active' : ''}`} title='Mode Clair' onClick={() => setTheme('light')}>
                <FiSun />
              </div>
              <div className={`mode-dark ${theme === 'dark' ? 'active' : ''}`} title='Mode Sombre' onClick={() => setTheme('dark')}>
                <FiMoon />
              </div>
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <button onClick={handleLogout} className="dropdown-item logout">
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
