import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from './UserAvatar'; // The user created this but didn't import it
import UserMenu from './UserMenu';
import './Sidebar.css';
import { FiGrid, FiUsers, FiBox, FiShoppingBag, FiSettings } from 'react-icons/fi';
import { FaTachometerAlt, FaUsers as FaUsersIcon, FaBoxOpen, FaShoppingCart, FaCog, FaSignOutAlt, FaListAlt, FaTags } from 'react-icons/fa';

const adminLinks = [
  { path: '/admin/dashboard', icon: <FiGrid />, label: 'Tableau de bord', end: true },
  { path: '/admin/dashboard/users', icon: <FiUsers />, label: 'Utilisateurs' },
  { path: '/admin/dashboard/products', icon: <FiBox />, label: 'Produits' },
  { path: '/admin/dashboard/orders', icon: <FiShoppingBag />, label: 'Commandes' },
  // Pour une utilisation future
  // { path: '/admin/categories', icon: <FaListAlt />, label: 'Catégories' },
  // { path: '/admin/tags', icon: <FaTags />, label: 'Tags' },
  // { path: '/admin/settings', icon: <FiSettings />, label: 'Paramètres' },
];

const sellerLinks = [
  { path: '/vendeur/dashboard', icon: <FiGrid />, label: 'Tableau de bord', end: true },
  { path: '/vendeur/dashboard/products', icon: <FiBox />, label: 'Mes Produits' },
  { path: '/vendeur/dashboard/orders', icon: <FiShoppingBag />, label: 'Mes Ventes' },
  // Pour une utilisation future
  // { path: '/vendeur/settings', icon: <FiSettings />, label: 'Paramètres' },
];

const clientLinks = [
  { path: '/client/dashboard', icon: <FiGrid />, label: 'Mon Compte', end: true },
  { path: '/client/dashboard/orders', icon: <FiShoppingBag />, label: 'Mes Commandes' },
  // Pour une utilisation future
  // { path: '/client/settings', icon: <FiSettings />, label: 'Paramètres' },
];

const navLinks = {
  admin: adminLinks,
  vendeur: sellerLinks,
  client: clientLinks,
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const links = user ? navLinks[user.role] : [];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/favicon.png" alt="Biyashara Logo" />
        <h1>Biyashara</h1>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {links.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} className="sidebar-link" end={link.end}>
                {link.icon}
                <span>{link.label}</span>
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
