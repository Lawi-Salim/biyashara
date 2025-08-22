import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import UserMenu from './UserMenu';
import './Sidebar.css';
import { FiGrid, FiUsers, FiBox, FiShoppingBag, FiSettings, FiLogOut, FiBell, FiHome, FiBriefcase, FiMessageSquare } from 'react-icons/fi';

const adminLinks = [
  { path: '/admin/dashboard', icon: <FiGrid />, label: 'Tableau de bord', end: true },
  { path: '/admin/dashboard/users', icon: <FiUsers />, label: 'Utilisateurs' },
  { path: '/admin/dashboard/vendeurs', icon: <FiBriefcase />, label: 'Vendeurs' },
  { path: '/admin/dashboard/products', icon: <FiBox />, label: 'Produits' },
  { path: '/admin/dashboard/orders', icon: <FiShoppingBag />, label: 'Commandes' },
  { path: '/admin/dashboard/notifications', icon: <FiBell />, label: 'Notifications' },
  { path: '/admin/dashboard/support', icon: <FiMessageSquare />, label: 'Support Vendeurs' },
  // Pour une utilisation future
  // { path: '/admin/categories', icon: <FaListAlt />, label: 'Catégories' },
  // { path: '/admin/tags', icon: <FaTags />, label: 'Tags' },
  // { path: '/admin/settings', icon: <FiSettings />, label: 'Paramètres' },
];

const sellerLinks = [
  { path: '/vendeur/dashboard', icon: <FiGrid />, label: 'Tableau de bord', end: true },
  { path: '/vendeur/dashboard/products', icon: <FiBox />, label: 'Mes Produits' },
  { path: '/vendeur/dashboard/orders', icon: <FiShoppingBag />, label: 'Mes Ventes' },
  { path: '/vendeur/dashboard/notifications', icon: <FiBell />, label: 'Notifications' },
  // Pour une utilisation future
  // { path: '/vendeur/settings', icon: <FiSettings />, label: 'Paramètres' },
];

const clientLinks = [
  { path: '/client/dashboard', icon: <FiGrid />, label: 'Mon Compte', end: true },
  { path: '/client/dashboard/orders', icon: <FiShoppingBag />, label: 'Mes Commandes' },
  { path: '/client/dashboard/notifications', icon: <FiBell />, label: 'Notifications' },
  // Pour une utilisation future
  // { path: '/client/settings', icon: <FiSettings />, label: 'Paramètres' },
];

const navLinks = {
  admin: adminLinks,
  vendeur: sellerLinks,
  client: clientLinks,
};

const Sidebar = () => {
  const { user } = useAuth();
  const { notificationCount } = useNotification();
  const links = user ? navLinks[user.role] : [];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/favicon.png" alt="Biyashara Logo" />
        <h1>Biyashara</h1>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {links.map((link, index) => (
            <li key={link.path}>
              <NavLink key={index} to={link.path} className={({ isActive }) => "sidebar-link " + (isActive ? "active" : "")} end={link.end}>
                {link.icon}
                <span>{link.label}</span>
                {link.label === 'Notifications' && notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <UserMenu />
      </div>
    </aside>
  );
};

export default Sidebar;
