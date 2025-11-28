import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout & Common Components
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
// Chatbot is assumed removed
// import { useSelector } from 'react-redux';

// Page Components
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import EnhancedSearch from './pages/EnhancedSearch';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import Marketplace from './pages/Marketplace';
import ListItemPage from './pages/ListItemPage';
import Profile from './pages/Profile';
import Education from './pages/Education';
import Community from './pages/Community';
import ComponentDetailsPage from './pages/ComponentDetailsPage';
import ShopDetails from './pages/ShopDetails';

// Styles
import './styles/globals.css';

// --- Main App Content ---
function AppContent() {
  return (
    <div className="App">
      <Routes>
        {/* Public Auth Routes (No Layout) */}
        <Route path="/" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes Wrapped by Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
              {/* Regular Protected Routes */}
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/search" element={<EnhancedSearch />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/list-item" element={<ListItemPage />} />
              <Route path="/component/:id" element={<ComponentDetailsPage />} />
              <Route path="/shop/:id" element={<ShopDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/education" element={<Education />} />
              <Route path="/community" element={<Community />} />

              {/* Nested Protected Admin Route */}
              <Route element={<ProtectedRoute isAdminRoute={true} />}>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/admin-panel" element={<AdminPanel />} />
              </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

// --- Top Level App ---
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;