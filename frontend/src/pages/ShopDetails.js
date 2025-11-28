import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShopDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchShopDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/shops/${id}`);
      setShop(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shop details:', error);
      setError('Failed to load shop details');
      setLoading(false);
    }
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
      maxWidth: '1200px',
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
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 2rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      marginBottom: '2rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    infoRow: {
      marginBottom: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    infoLabel: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    infoValue: {
      fontSize: '1.1rem',
      color: '#333',
      fontWeight: '500'
    },
    contactInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#667eea',
      fontWeight: '600'
    },
    wastesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '0.75rem',
      marginTop: '1rem'
    },
    wasteChip: {
      padding: '0.75rem 1rem',
      backgroundColor: '#e8eaf6',
      color: '#667eea',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '600',
      textAlign: 'center',
      border: '2px solid #667eea'
    },
    mapCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      gridColumn: '1 / -1'
    },
    mapContainer: {
      height: '400px',
      borderRadius: '8px',
      overflow: 'hidden',
      marginTop: '1rem'
    },
    actionButtons: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem'
    },
    actionButton: {
      flex: 1,
      padding: '1rem',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    primaryButton: {
      backgroundColor: '#667eea',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#f4f7f6',
      color: '#667eea',
      border: '2px solid #667eea'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      fontSize: '1.2rem',
      color: '#666'
    },
    error: {
      textAlign: 'center',
      padding: '3rem',
      color: '#dc3545'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading shop details...</div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error || 'Shop not found'}</div>
      </div>
    );
  }

  const shopPosition = shop.location?.coordinates 
    ? [shop.location.coordinates[1], shop.location.coordinates[0]]
    : [0, 0];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.headerTitle}>{shop.name}</h1>
            <p style={{ margin: 0, opacity: 0.9 }}>E-Waste Collection Center Details</p>
          </div>
          <button
            style={styles.backButton}
            onClick={() => navigate(-1)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.target.style.color = 'white';
            }}
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.grid}>
          {/* Basic Information */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <span>ℹ️</span>
              Basic Information
            </h2>
            
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Shop Name</span>
              <span style={styles.infoValue}>{shop.name}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Address</span>
              <span style={styles.infoValue}>{shop.address}</span>
            </div>

            {shop.location?.coordinates && (
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Coordinates</span>
                <span style={styles.infoValue}>
                  {shop.location.coordinates[1].toFixed(6)}, {shop.location.coordinates[0].toFixed(6)}
                </span>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <span>📞</span>
              Contact Information
            </h2>

            {(shop.contact || (typeof shop.contact === 'object' && shop.contact?.phone)) && (
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Phone</span>
                <span style={styles.contactInfo}>
                  📱 {typeof shop.contact === 'string' ? shop.contact : shop.contact?.phone}
                </span>
              </div>
            )}

            {(shop.email || (typeof shop.contact === 'object' && shop.contact?.email)) && (
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.contactInfo}>
                  ✉️ {shop.email || shop.contact?.email}
                </span>
              </div>
            )}

            {shop.openingHours && (
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Operating Hours</span>
                <span style={styles.infoValue}>{shop.openingHours}</span>
              </div>
            )}

            {!shop.contact && !shop.email && (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                Contact information not available
              </p>
            )}
          </div>

          {/* Accepted Items */}
          <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
            <h2 style={styles.cardTitle}>
              <span>♻️</span>
              Accepted E-Waste Items
            </h2>

            {shop.acceptedWastes && shop.acceptedWastes.length > 0 ? (
              <div style={styles.wastesGrid}>
                {shop.acceptedWastes.map((waste, index) => (
                  <div key={index} style={styles.wasteChip}>
                    {waste}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                No specific items listed
              </p>
            )}
          </div>

          {/* Map */}
          <div style={styles.mapCard}>
            <h2 style={styles.cardTitle}>
              <span>🗺️</span>
              Location on Map
            </h2>

            {shop.location?.coordinates ? (
              <div style={styles.mapContainer}>
                <MapContainer
                  center={shopPosition}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={shopPosition}>
                    <Popup>
                      <strong>{shop.name}</strong>
                      <br />
                      {shop.address}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                Location not available
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button
            style={{ ...styles.actionButton, ...styles.primaryButton }}
            onClick={() => {
              const phone = typeof shop.contact === 'string' ? shop.contact : shop.contact?.phone;
              if (phone) {
                // Show a prompt to allow the user to copy the number (works on all devices)
                // This ensures visible feedback even if the 'tel:' link fails on desktop
                prompt("To contact the shop, call or copy this number:", phone);
                
                // Try to open the default calling app
                const sanitized = phone.replace(/[^\d+]/g, '');
                if (sanitized) {
                    window.location.href = `tel:${sanitized}`;
                }
              } else {
                alert('Sorry, no contact number is available for this shop.');
              }
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
          >
            <span>📞</span>
            Contact Shop
          </button>
          <button
            style={{ ...styles.actionButton, ...styles.secondaryButton }}
            onClick={() => {
              if (shop.location?.coordinates) {
                const [lng, lat] = shop.location.coordinates;
                window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
              }
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#667eea';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f4f7f6';
              e.target.style.color = '#667eea';
            }}
          >
            <span>🧭</span>
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
