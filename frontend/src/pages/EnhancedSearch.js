import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import '../styles/globals.css';

const EnhancedSearch = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [itemSearch, setItemSearch] = useState('');
  const [viewMode, setViewMode] = useState('map');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    filterShops();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSearch, shops]);

  const fetchShops = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/shops');
      setShops(data);
      setFilteredShops(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setLoading(false);
    }
  };

  const filterShops = () => {
    if (!itemSearch.trim()) {
      setFilteredShops(shops);
      return;
    }

    const searchLower = itemSearch.toLowerCase();
    const filtered = shops.filter(shop => 
      shop.acceptedWastes?.some(waste => 
        waste.toLowerCase().includes(searchLower)
      ) ||
      shop.name.toLowerCase().includes(searchLower) ||
      shop.address.toLowerCase().includes(searchLower)
    );
    setFilteredShops(filtered);
  };

  const wasteCategories = [
    'Phones', 'Laptops', 'Tablets', 'Computers', 'Televisions',
    'Monitors', 'Printers', 'Cameras', 'Gaming Consoles',
    'Smart Watches', 'Batteries', 'Chargers', 'Other Electronics'
  ];

  const styles = {
    container: {
      backgroundColor: '#f4f7f6',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      color: 'white'
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
    headerTitle: {
      margin: '0 0 0.5rem 0',
      fontSize: '2rem',
      fontWeight: 'bold'
    },
    headerSubtitle: {
      margin: 0,
      opacity: 0.9,
      fontSize: '1rem'
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
      display: 'inline-block'
    },
    searchSection: {
      backgroundColor: 'white',
      padding: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    searchContent: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    searchTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '1rem'
    },
    searchInputWrapper: {
      position: 'relative',
      marginBottom: '1.5rem'
    },
    searchInput: {
      width: '100%',
      padding: '1rem 1rem 1rem 3rem',
      fontSize: '1rem',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.3s',
      boxSizing: 'border-box'
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '1.2rem',
      color: '#667eea'
    },
    quickFilters: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      marginBottom: '1rem'
    },
    filterChip: {
      padding: '0.5rem 1rem',
      backgroundColor: '#f4f7f6',
      border: '2px solid transparent',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#666',
      transition: 'all 0.3s'
    },
    resultsBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px'
    },
    resultsText: {
      color: '#666',
      fontWeight: '600'
    },
    viewToggle: {
      display: 'flex',
      gap: '0.5rem',
      backgroundColor: 'white',
      padding: '0.25rem',
      borderRadius: '8px',
      border: '1px solid #e0e0e0'
    },
    viewButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#666',
      cursor: 'pointer',
      borderRadius: '6px',
      fontWeight: '600',
      transition: 'all 0.3s'
    },
    viewButtonActive: {
      backgroundColor: '#667eea',
      color: 'white'
    },
    contentSection: {
      flex: 1,
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    },
    mapContainer: {
      height: '600px',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    listGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem'
    },
    shopCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'all 0.3s',
      cursor: 'pointer'
    },
    shopName: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '0.5rem'
    },
    shopAddress: {
      color: '#666',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    shopContact: {
      color: '#667eea',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontWeight: '600'
    },
    wastesSection: {
      marginTop: '1rem'
    },
    wastesTitle: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#666',
      marginBottom: '0.5rem'
    },
    wastesTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    wasteTag: {
      padding: '0.25rem 0.75rem',
      backgroundColor: '#e8eaf6',
      color: '#667eea',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: '600'
    },
    viewDetailsButton: {
      marginTop: '1rem',
      padding: '0.75rem',
      width: '100%',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    noResults: {
      textAlign: 'center',
      padding: '3rem',
      color: '#666'
    },
    noResultsIcon: {
      fontSize: '4rem',
      marginBottom: '1rem'
    },
    noResultsText: {
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '0.5rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.headerTitle}>🔍 Search E-Waste Shops</h1>
            <p style={styles.headerSubtitle}>
              Find shops by item type or browse all collection centers
            </p>
          </div>
          <Link 
            to="/dashboard" 
            style={styles.backButton}
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
          </Link>
        </div>
      </header>

      {/* Search Section */}
      <div style={styles.searchSection}>
        <div style={styles.searchContent}>
          <h2 style={styles.searchTitle}>Search by Item Type</h2>
          
          {/* Search Input */}
          <div style={styles.searchInputWrapper}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Enter item type (e.g., Phones, Laptops, Batteries...)"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {/* Quick Filter Chips */}
          <div style={styles.quickFilters}>
            {wasteCategories.slice(0, 8).map((category) => (
              <button
                key={category}
                style={{
                  ...styles.filterChip,
                  ...(itemSearch.toLowerCase() === category.toLowerCase() ? {
                    backgroundColor: '#667eea',
                    color: 'white',
                    borderColor: '#667eea'
                  } : {})
                }}
                onClick={() => setItemSearch(category)}
                onMouseEnter={(e) => {
                  if (itemSearch.toLowerCase() !== category.toLowerCase()) {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.color = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (itemSearch.toLowerCase() !== category.toLowerCase()) {
                    e.target.style.borderColor = 'transparent';
                    e.target.style.color = '#666';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Bar */}
          <div style={styles.resultsBar}>
            <span style={styles.resultsText}>
              {loading ? 'Loading...' : `${filteredShops.length} shop${filteredShops.length !== 1 ? 's' : ''} found`}
            </span>
            <div style={styles.viewToggle}>
              <button
                style={{
                  ...styles.viewButton,
                  ...(viewMode === 'map' ? styles.viewButtonActive : {})
                }}
                onClick={() => setViewMode('map')}
              >
                🗺️ Map
              </button>
              <button
                style={{
                  ...styles.viewButton,
                  ...(viewMode === 'list' ? styles.viewButtonActive : {})
                }}
                onClick={() => setViewMode('list')}
              >
                📋 List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div style={styles.contentSection}>
        {viewMode === 'map' ? (
          <div style={styles.mapContainer}>
            <MapComponent shops={filteredShops} />
          </div>
        ) : (
          <div style={styles.listGrid}>
            {filteredShops.length > 0 ? (
              filteredShops.map((shop) => (
                <div
                  key={shop._id}
                  style={styles.shopCard}
                  onClick={() => navigate(`/shop/${shop._id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  <h3 style={styles.shopName}>{shop.name}</h3>
                  <p style={styles.shopAddress}>
                    <span>📍</span>
                    {shop.address}
                  </p>
                  {shop.contact && (
                    <p style={styles.shopContact}>
                      <span>📞</span>
                      {shop.contact.phone || shop.contact.email || 'Contact available'}
                    </p>
                  )}
                  
                  {shop.acceptedWastes && shop.acceptedWastes.length > 0 && (
                    <div style={styles.wastesSection}>
                      <p style={styles.wastesTitle}>Accepted Items:</p>
                      <div style={styles.wastesTags}>
                        {shop.acceptedWastes.slice(0, 6).map((waste, index) => (
                          <span key={index} style={styles.wasteTag}>
                            {waste}
                          </span>
                        ))}
                        {shop.acceptedWastes.length > 6 && (
                          <span style={styles.wasteTag}>
                            +{shop.acceptedWastes.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    style={styles.viewDetailsButton}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
                  >
                    View Details →
                  </button>
                </div>
              ))
            ) : (
              <div style={styles.noResults}>
                <div style={styles.noResultsIcon}>🔍</div>
                <p style={styles.noResultsText}>No shops found</p>
                <p>Try searching for a different item type or clear filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSearch;
