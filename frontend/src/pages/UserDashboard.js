import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    nearbyShops: 0,
    purchasedItems: 0,
    soldItems: 0
  });

  useEffect(() => {
    fetchUserStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserStats = async () => {
    try {
      const [shopsRes, purchasedRes, soldRes] = await Promise.all([
        axios.get('http://localhost:5000/api/shops/nearby?longitude=77.5946&latitude=12.9716'),
        axios.get('http://localhost:5000/api/users/me/purchased', {
          headers: { Authorization: `Bearer ${user.token}` }
        }),
        axios.get('http://localhost:5000/api/users/me/sold', {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      ]);

      setStats({
        nearbyShops: shopsRes.data.length || 0,
        purchasedItems: purchasedRes.data.results || 0,
        soldItems: soldRes.data.results || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const quickActions = [
    {
      title: 'Find E-Waste Centers',
      description: 'Locate nearby collection points',
      icon: '🗺️',
      link: '/search',
      color: '#667eea'
    },
    {
      title: 'Browse Marketplace',
      description: 'Buy or sell e-waste components',
      icon: '🛒',
      link: '/marketplace',
      color: '#28a745'
    },
    {
      title: 'My Profile',
      description: 'View activity & history',
      icon: '👤',
      link: '/profile',
      color: '#17a2b8'
    },
    {
      title: 'Community',
      description: 'Join discussions & forums',
      icon: '💬',
      link: '/community',
      color: '#6f42c1'
    },
    {
      title: 'Education',
      description: 'Learn about e-waste',
      icon: '📚',
      link: '/education',
      color: '#fd7e14'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '3rem 2rem',
        color: 'white',
        marginBottom: '2rem',
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }} />
        <h1 style={{
          margin: 0,
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
          position: 'relative',
          zIndex: 1
        }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{
          margin: 0,
          fontSize: '1.1rem',
          opacity: 0.95,
          position: 'relative',
          zIndex: 1
        }}>
          Your E-Waste Management Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderLeft: '5px solid #667eea'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏪</div>
          <h3 style={{ margin: 0, color: '#667eea', fontSize: '2rem' }}>
            {stats.nearbyShops}
          </h3>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Nearby E-Waste Shops</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderLeft: '5px solid #28a745'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
          <h3 style={{ margin: 0, color: '#28a745', fontSize: '2rem' }}>
            {stats.purchasedItems}
          </h3>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Items Purchased</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderLeft: '5px solid #ffc107'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
          <h3 style={{ margin: 0, color: '#ffc107', fontSize: '2rem' }}>
            {stats.soldItems}
          </h3>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Items Sold</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '1.5rem',
          color: '#1a252f',
          fontSize: '1.8rem'
        }}>
          🚀 Quick Actions
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              style={{
                textDecoration: 'none',
                backgroundColor: '#f8f9fa',
                padding: '2rem',
                borderRadius: '16px',
                border: '2px solid #e0e0e0',
                transition: 'all 0.3s',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = action.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {action.icon}
              </div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: action.color,
                textAlign: 'center',
                fontSize: '1.2rem'
              }}>
                {action.title}
              </h3>
              <p style={{
                margin: 0,
                color: '#666',
                textAlign: 'center',
                fontSize: '0.95rem'
              }}>
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '2rem',
        marginTop: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '1.5rem',
          color: '#1a252f',
          fontSize: '1.8rem'
        }}>
          📊 Recent Activity
        </h2>
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
          Your recent transactions and activities will appear here.
          <br />
          <Link to="/profile" style={{ color: '#667eea', fontWeight: '600' }}>
            View detailed history →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
