import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../styles/globals.css';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalComponents: 0,
    recentActivity: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const usersRes = await axios.get('http://localhost:5000/api/users/all', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsers(usersRes.data.data.users || []);

      // Fetch statistics
      const statsRes = await axios.get('http://localhost:5000/api/users/stats', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStats(statsRes.data.data || stats);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${userId}/toggle-status`, 
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Refresh user list
      fetchAdminData();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${color}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{title}</p>
        <h2 style={{ margin: '0.5rem 0 0 0', color: '#1a252f', fontSize: '2rem' }}>{value}</h2>
      </div>
      <div style={{ fontSize: '3rem', opacity: 0.3 }}>{icon}</div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1a252f 0%, #2d3e50 100%)',
        color: 'white',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>🔐 Admin Dashboard</h1>
              <p style={{ margin: 0, opacity: 0.9 }}>Monitor and manage all system activities</p>
            </div>
            <Link to="/dashboard" style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              border: '2px solid white'
            }}>
              ← Back to Dashboard
            </Link>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {['overview', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeTab === tab ? 'white' : 'rgba(255,255,255,0.1)',
                  color: activeTab === tab ? '#1a252f' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <p>Loading admin data...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                <h2 style={{ color: '#1a252f', marginBottom: '1.5rem' }}>System Overview</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '3rem'
                }}>
                  <StatCard title="Total Users" value={stats.totalUsers || users.length} icon="👥" color="#667eea" />
                  <StatCard title="E-Waste Shops" value={stats.totalShops || 0} icon="🏪" color="#28a745" />
                  <StatCard title="Components Listed" value={stats.totalComponents || 0} icon="📦" color="#17a2b8" />
                </div>
              </>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <>
                <h2 style={{ color: '#1a252f', marginBottom: '1.5rem' }}>
                  All Users ({users.length})
                </h2>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Name</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Email</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Role</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Points</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Joined</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Status</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, index) => (
                        <tr key={u._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '1rem' }}>{u.name}</td>
                          <td style={{ padding: '1rem' }}>{u.email}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              backgroundColor: u.role === 'admin' ? '#fee' : '#efe',
                              color: u.role === 'admin' ? '#c33' : '#282',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>{u.points || 0}</td>
                          <td style={{ padding: '1rem' }}>
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              backgroundColor: u.isActive ? '#d4edda' : '#f8d7da',
                              color: u.isActive ? '#155724' : '#721c24',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <button
                              onClick={() => toggleUserStatus(u._id, u.isActive)}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: u.isActive ? '#dc3545' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                              }}
                            >
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
