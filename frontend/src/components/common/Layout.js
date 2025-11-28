import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary';
import NotificationDropdown from './NotificationDropdown';
import { initSocket, disconnectSocket } from '../../services/socket';
import './Layout.css';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.token) {
      initSocket(user.token);
    }
    return () => {
      disconnectSocket();
    };
  }, [user]);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        {/* Top Bar for Notifications */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          padding: '1rem 2rem', 
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '600', color: '#555' }}>Welcome, {user?.name}</span>
            <NotificationDropdown />
          </div>
        </div>

        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Layout;