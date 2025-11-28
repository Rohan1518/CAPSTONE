import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [listedItems, setListedItems] = useState([]);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/user-login');
      return;
    }
    setUser(userData);
    fetchUserData(userData.token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch user's purchased items
      const purchasedResponse = await axios.get(
        'http://localhost:5000/api/users/me/purchased',
        config
      );
      setPurchasedItems(purchasedResponse.data || []);

      // Fetch user's sold items
      const soldResponse = await axios.get(
        'http://localhost:5000/api/users/me/sold',
        config
      );
      setSoldItems(soldResponse.data || []);

      // Fetch user's listed components
      const componentsResponse = await axios.get(
        'http://localhost:5000/api/components',
        config
      );
      const userComponents = componentsResponse.data.filter(
        comp => comp.user?._id === user?._id || comp.userId === user?._id
      );
      setListedItems(userComponents || []);

      // Fetch tracking history
      const trackingResponse = await axios.get(
        'http://localhost:5000/api/tracking',
        config
      );
      setTrackingHistory(trackingResponse.data || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      'in-transit': '#2196f3',
      delivered: '#4caf50',
      cancelled: '#f44336',
      completed: '#4caf50'
    };
    return colors[status?.toLowerCase()] || '#666';
  };

  const styles = {
    container: {
      backgroundColor: '#f4f7f6',
      minHeight: '100vh'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem'
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
      border: '3px solid white'
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    userName: {
      fontSize: '2rem',
      fontWeight: 'bold',
      margin: 0
    },
    userEmail: {
      fontSize: '1rem',
      opacity: 0.9,
      margin: 0
    },
    userRole: {
      fontSize: '0.85rem',
      opacity: 0.8,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      margin: 0
    },
    backButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      border: '2px solid white',
      transition: 'all 0.3s',
      cursor: 'pointer'
    },
    content: {
      maxWidth: '1400px',
      margin: '2rem auto',
      padding: '0 2rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    statIcon: {
      fontSize: '2.5rem'
    },
    statInfo: {
      flex: 1
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#333',
      margin: '0 0 0.25rem 0'
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#666',
      margin: 0
    },
    tabsContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    },
    tabsHeader: {
      display: 'flex',
      borderBottom: '2px solid #f0f0f0'
    },
    tab: {
      flex: 1,
      padding: '1rem',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      color: '#666',
      transition: 'all 0.3s',
      borderBottom: '3px solid transparent'
    },
    tabActive: {
      color: '#667eea',
      borderBottomColor: '#667eea'
    },
    tabContent: {
      padding: '2rem'
    },
    itemsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    itemCard: {
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      padding: '1.5rem',
      border: '2px solid #e0e0e0',
      transition: 'all 0.3s'
    },
    itemHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '1rem'
    },
    itemName: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
    },
    itemPrice: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#667eea'
    },
    itemDetail: {
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '0.5rem',
      display: 'flex',
      gap: '0.5rem'
    },
    itemDate: {
      fontSize: '0.85rem',
      color: '#999',
      marginTop: '0.5rem'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: '600',
      color: 'white'
    },
    timelineContainer: {
      position: 'relative',
      paddingLeft: '2rem'
    },
    timelineItem: {
      position: 'relative',
      paddingBottom: '2rem',
      borderLeft: '2px solid #e0e0e0',
      paddingLeft: '2rem'
    },
    timelineIcon: {
      position: 'absolute',
      left: '-1rem',
      top: 0,
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      backgroundColor: '#667eea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      color: 'white'
    },
    timelineContent: {
      backgroundColor: '#f9f9f9',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #e0e0e0'
    },
    timelineTitle: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#333',
      margin: '0 0 0.5rem 0'
    },
    timelineText: {
      fontSize: '0.9rem',
      color: '#666',
      margin: '0 0 0.5rem 0'
    },
    timelineDate: {
      fontSize: '0.85rem',
      color: '#999',
      margin: 0
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#666'
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      opacity: 0.5
    },
    emptyText: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '0.5rem'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitial = user.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.profileSection}>
            <div style={styles.avatar}>{userInitial}</div>
            <div style={styles.userInfo}>
              <h1 style={styles.userName}>{user.name}</h1>
              <p style={styles.userEmail}>{user.email}</p>
              <p style={styles.userRole}>Role: {user.role}</p>
            </div>
          </div>
          <button
            style={styles.backButton}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.target.style.color = 'white';
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={styles.content}>
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🛒</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statValue}>{purchasedItems.length}</h3>
              <p style={styles.statLabel}>Items Purchased</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statValue}>{soldItems.length}</h3>
              <p style={styles.statLabel}>Items Sold</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📦</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statValue}>{listedItems.length}</h3>
              <p style={styles.statLabel}>Listed Items</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>🚚</div>
            <div style={styles.statInfo}>
              <h3 style={styles.statValue}>{trackingHistory.length}</h3>
              <p style={styles.statLabel}>Tracked Shipments</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabsHeader}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'overview' ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'purchased' ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab('purchased')}
            >
              🛒 Purchased
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'sold' ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab('sold')}
            >
              💰 Sold
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'listed' ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab('listed')}
            >
              📦 My Listings
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'tracking' ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab('tracking')}
            >
              🚚 Tracking
            </button>
          </div>

          <div style={styles.tabContent}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div style={styles.timelineContainer}>
                <h2 style={{ marginBottom: '2rem', color: '#333' }}>Recent Activity</h2>
                
                {[...purchasedItems, ...soldItems, ...listedItems]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 10)
                  .map((item, index) => (
                    <div key={index} style={styles.timelineItem}>
                      <div style={styles.timelineIcon}>
                        {item.buyer ? '💰' : item.seller ? '🛒' : '📦'}
                      </div>
                      <div style={styles.timelineContent}>
                        <h4 style={styles.timelineTitle}>
                          {item.buyer ? 'Sold' : item.seller ? 'Purchased' : 'Listed'}: {item.name || item.itemType}
                        </h4>
                        <p style={styles.timelineText}>
                          {item.condition && `Condition: ${item.condition} • `}
                          Price: ₹{item.price || item.estimatedPrice}
                        </p>
                        <p style={styles.timelineDate}>
                          {formatDate(item.createdAt || item.listedAt)}
                        </p>
                      </div>
                    </div>
                  ))}

                {purchasedItems.length === 0 && soldItems.length === 0 && listedItems.length === 0 && (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📭</div>
                    <p style={styles.emptyText}>No activity yet</p>
                    <p>Start buying or selling e-waste items!</p>
                  </div>
                )}
              </div>
            )}

            {/* Purchased Tab */}
            {activeTab === 'purchased' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Purchased Items</h2>
                {purchasedItems.length > 0 ? (
                  <div style={styles.itemsGrid}>
                    {purchasedItems.map((item) => (
                      <div key={item._id} style={styles.itemCard}>
                        <div style={styles.itemHeader}>
                          <h3 style={styles.itemName}>{item.name || item.itemType}</h3>
                          <span style={styles.itemPrice}>₹{item.price}</span>
                        </div>
                        <div style={styles.itemDetail}>
                          <strong>Condition:</strong> {item.condition}
                        </div>
                        {item.seller && (
                          <div style={styles.itemDetail}>
                            <strong>Seller:</strong> {item.seller.name}
                          </div>
                        )}
                        <div style={styles.itemDate}>
                          Purchased on {formatDate(item.purchasedAt || item.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🛒</div>
                    <p style={styles.emptyText}>No purchases yet</p>
                    <p>Browse the marketplace to find items!</p>
                  </div>
                )}
              </div>
            )}

            {/* Sold Tab */}
            {activeTab === 'sold' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Sold Items</h2>
                {soldItems.length > 0 ? (
                  <div style={styles.itemsGrid}>
                    {soldItems.map((item) => (
                      <div key={item._id} style={styles.itemCard}>
                        <div style={styles.itemHeader}>
                          <h3 style={styles.itemName}>{item.name || item.itemType}</h3>
                          <span style={styles.itemPrice}>₹{item.price}</span>
                        </div>
                        <div style={styles.itemDetail}>
                          <strong>Condition:</strong> {item.condition}
                        </div>
                        {item.buyer && (
                          <div style={styles.itemDetail}>
                            <strong>Buyer:</strong> {item.buyer.name}
                          </div>
                        )}
                        <div style={styles.itemDate}>
                          Sold on {formatDate(item.soldAt || item.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>💰</div>
                    <p style={styles.emptyText}>No sales yet</p>
                    <p>List your e-waste items in the marketplace!</p>
                  </div>
                )}
              </div>
            )}

            {/* Listed Tab */}
            {activeTab === 'listed' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>My Listings</h2>
                {listedItems.length > 0 ? (
                  <div style={styles.itemsGrid}>
                    {listedItems.map((item) => (
                      <div key={item._id} style={styles.itemCard}>
                        <div style={styles.itemHeader}>
                          <h3 style={styles.itemName}>{item.itemType}</h3>
                          <span style={styles.itemPrice}>₹{item.estimatedPrice}</span>
                        </div>
                        <div style={styles.itemDetail}>
                          <strong>Condition:</strong> {item.condition}
                        </div>
                        <div style={styles.itemDetail}>
                          <strong>Quantity:</strong> {item.quantity}
                        </div>
                        <div style={styles.itemDate}>
                          Listed on {formatDate(item.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📦</div>
                    <p style={styles.emptyText}>No active listings</p>
                    <p>List your e-waste items to start selling!</p>
                  </div>
                )}
              </div>
            )}

            {/* Tracking Tab */}
            {activeTab === 'tracking' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Shipment Tracking</h2>
                {trackingHistory.length > 0 ? (
                  <div style={styles.itemsGrid}>
                    {trackingHistory.map((tracking) => (
                      <div key={tracking._id} style={styles.itemCard}>
                        <div style={styles.itemHeader}>
                          <h3 style={styles.itemName}>Tracking #{tracking.trackingNumber || tracking._id.slice(-6)}</h3>
                          <span
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: getStatusColor(tracking.status)
                            }}
                          >
                            {tracking.status}
                          </span>
                        </div>
                        <div style={styles.itemDetail}>
                          <strong>From:</strong> {tracking.senderName}
                        </div>
                        <div style={styles.itemDetail}>
                          <strong>To:</strong> {tracking.receiverName}
                        </div>
                        {tracking.estimatedDelivery && (
                          <div style={styles.itemDetail}>
                            <strong>Est. Delivery:</strong> {formatDate(tracking.estimatedDelivery)}
                          </div>
                        )}
                        <div style={styles.itemDate}>
                          Created {formatDate(tracking.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🚚</div>
                    <p style={styles.emptyText}>No tracked shipments</p>
                    <p>Your shipment tracking will appear here!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;