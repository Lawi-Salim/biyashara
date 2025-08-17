import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSeller from './pages/RegisterSeller';
import ProtectedRoute from './components/ProtectedRoute';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import VendeurDashboard from './pages/dashboard/VendeurDashboard';
import AdminUsers from './pages/sidebars/sidebarAdmin/AdminUsers';
import AdminProducts from './pages/sidebars/sidebarAdmin/AdminProducts';
import AdminOrders from './pages/sidebars/sidebarAdmin/AdminOrders';
import VendeurProducts from './pages/sidebars/sidebarVendeur/VendeurProducts';
import VendeurOrders from './pages/sidebars/sidebarVendeur/VendeurOrders';
import ClientOrders from './pages/sidebars/sidebarClient/ClientOrders';
import ToastContainer from './components/ToastContainer';
import './components/Navbar.css';
import './components/Footer.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ToastContainer />
        <ThemeProvider>
          <AppContent />
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

            {/* Routes protégées */}
            <Route path="/client/dashboard" element={<ProtectedRoute requiredRole="client" outlet={<ClientDashboard />} />}>
              <Route path="orders" element={<ClientOrders />} />
            </Route>

            <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin" outlet={<AdminDashboard />} />}>
              <Route path="users" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>

            <Route path="/vendeur/dashboard" element={<ProtectedRoute requiredRole="vendeur" outlet={<VendeurDashboard />} />}>
              <Route path="products" element={<VendeurProducts />} />
              <Route path="orders" element={<VendeurOrders />} />
            </Route>
          </Routes>
        </div>
      </main>
      {shouldShowNavFooter && <Footer />}
    </div>
  );
}

export default App;