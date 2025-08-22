import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSeller from './pages/RegisterSeller';
import BoutiquesList from './pages/BoutiquesList';
import BoutiqueDetail from './pages/BoutiqueDetail';
import ProtectedRoute from './components/ProtectedRoute';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import VendeurDashboard from './pages/dashboard/VendeurDashboard';
import AdminUsers from './pages/sidebars/sidebarAdmin/AdminUsers';
import AdminProducts from './pages/sidebars/sidebarAdmin/AdminProducts';
import AdminOrders from './pages/sidebars/sidebarAdmin/AdminOrders';
import AdminVendeurs from './pages/sidebars/sidebarAdmin/AdminVendeurs';
import AdminSupport from './pages/sidebars/sidebarAdmin/AdminSupport';
import VendeurProducts from './pages/sidebars/sidebarVendeur/VendeurProducts';
import VendeurOrders from './pages/sidebars/sidebarVendeur/VendeurOrders';
import ClientOrders from './pages/sidebars/sidebarClient/ClientOrders';
import Settings from './pages/dashboard/Settings';
import Notifications from './pages/dashboard/Notifications';
import ToastContainer from './components/ToastContainer';
import './components/Navbar.css';
import './components/Footer.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ToastContainer />
        <ThemeProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const noNavFooterRoutes = ['/login', '/register', '/seller/register', '/dashboard', '/admin/dashboard', '/vendeur/dashboard', '/client/dashboard'];
  const shouldShowNavFooter = !noNavFooterRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div className="App flex flex-col min-h-screen">
      {shouldShowNavFooter && <Navbar />}
      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          <Route path="/seller/register" element={<RegisterSeller />} />
            <Route path="/boutiques" element={<BoutiquesList />} />
            <Route path="/boutiques/:slug" element={<BoutiqueDetail />} />

            {/* Routes protégées */}
            <Route path="/client/dashboard" element={<ProtectedRoute requiredRole="client" outlet={<ClientDashboard />} />}>
              <Route path="orders" element={<ClientOrders />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin" outlet={<AdminDashboard />} />}>
              <Route path="users" element={<AdminUsers />} />
              <Route path="vendeurs" element={<AdminVendeurs />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="/vendeur/dashboard" element={<ProtectedRoute requiredRole="vendeur" outlet={<VendeurDashboard />} />}>
              <Route path="products" element={<VendeurProducts />} />
              <Route path="orders" element={<VendeurOrders />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>

          </Routes>
        </div>
      </main>
      {shouldShowNavFooter && <Footer />}
    </div>
  );
}

export default App;