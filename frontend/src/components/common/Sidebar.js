import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutSuccess } from '../../store/slices/authSlice';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">♻️</div>
        <div className="sidebar-title">E-Waste Locator</div>
      </div>

      <div className="sidebar-nav">
        {/* Admin-Specific Menu */}
        {isAdmin && (
          <>
            <div className="sidebar-section-label">Admin Panel</div>
            <NavLink to="/admin-dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span>📊</span> User Monitoring
            </NavLink>
            <NavLink to="/admin-panel" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span>🏪</span> Manage Shops
            </NavLink>
          </>
        )}

        <div className="sidebar-section-label">Menu</div>
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span>🏠</span> Dashboard
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span>🗺️</span> Find Centers
        </NavLink>
        <NavLink to="/marketplace" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span>🛒</span> Marketplace
        </NavLink>
        <NavLink to="/list-item" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span>➕</span> Sell Item
        </NavLink>
        <NavLink to="/community" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span>💬</span> Community
        </NavLink>
        <NavLink to="/education" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span>📚</span> Education
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span>👤</span> Profile
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
