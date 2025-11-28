import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, Circle } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons for different markers
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNjY3ZWVhIj48cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzczctNy43NSA3LTEzYzAtMy44Ny0zLjEzLTctNy03em0wIDkuNWMtMS4zOCAwLTIuNS0xLjEyLTIuNS0yLjVzMS4xMi0yLjUgMi41LTIuNSAyLjUgMS4xMiAyLjUgMi41LTEuMTIgMi41LTIuNSAyLjV6Ii8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const shopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMjhhNzQ1Ij48cGF0aCBkPSJNMjAgNEg0djJoMTZWNHptMSAx==MHYtMmEyIDIgMCAwIDAtMi0ySDVjLTEuMTEgMC0yIC45LTIgMnYyYzAgLjU1LjQ1IDEgMSAxczEtLjQ1IDEtMVY2aDE0djJjMCAuNTUuNDUgMSAxIDFzMS0uNDUgMS0xem0tMiA0SDVWNmgxNHYyeiIvPjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Helper component to recenter map when location is found
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

// Custom component to handle map flying
// eslint-disable-next-line no-unused-vars
const MapFlyTo = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

const MapComponent = ({ filterItemType = null, shops: propsShops = null }) => {
  const [userLocation, setUserLocation] = useState(null); // [lat, lng]
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState(null); // To trigger flyTo
  const searchRadius = 10000; // 10km in meters
  const navigate = useNavigate();

  // If shops are provided via props (from EnhancedSearch), use them directly
  useEffect(() => {
    if (propsShops !== null) {
      setShops(propsShops);
      setLoading(false);
      setError(''); // Clear any previous errors
      
      // Set default center based on first shop or use a default location
      if (propsShops.length > 0 && propsShops[0]?.location?.coordinates && propsShops[0].location.coordinates.length === 2) {
        const [lng, lat] = propsShops[0].location.coordinates;
        setUserLocation([lat, lng]);
      } else {
        // Default to a generic location if no coordinates
        setUserLocation([28.6139, 77.2090]); // Delhi, India as default
      }
      return;
    }
  }, [propsShops]);

  useEffect(() => {
    // Skip geolocation if shops are provided via props
    if (propsShops !== null) return;

    // 1. Get User's Location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (err) => {
        console.error('Geolocation error:', err);
        // Use default location even if geolocation fails
        setUserLocation([28.6139, 77.2090]); // Delhi, India as default
        setLoading(false);
      }
    );
  }, [propsShops]);

  useEffect(() => {
    // Skip fetching if shops are provided via props
    if (propsShops !== null) return;

    // 2. Fetch shops once we have the user's location
    if (userLocation) {
      const fetchNearbyShops = async () => {
        try {
          setLoading(true);
          const [latitude, longitude] = userLocation;
          
          // Call our backend API
          const { data } = await axios.get(
            `http://localhost:5000/api/shops/nearby?longitude=${longitude}&latitude=${latitude}`
          );
          
          // Filter shops based on item type if provided
          if (filterItemType) {
            const filtered = data.filter(shop => 
              shop.acceptedWastes && shop.acceptedWastes.includes(filterItemType)
            );
            setShops(filtered);
          } else {
            setShops(data);
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching shops:', err);
          setError('Could not fetch nearby shops. Please try again.');
          setLoading(false);
        }
      };

      fetchNearbyShops();
    }
  }, [userLocation, filterItemType, propsShops]); // Re-run when location or filter changes

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!locationQuery.trim()) return;

    setIsSearchingLocation(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&limit=1`
      );
      
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const newCenter = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCenter);
        // Optional: You could also fetch shops near this new location here
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching location');
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const styles = {
    container: {
      position: 'relative',
      height: '100%',
      width: '100%'
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    errorContainer: {
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '8px',
      margin: '2rem'
    },
    shopList: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      padding: '1rem',
      maxWidth: '300px',
      maxHeight: '400px',
      overflowY: 'auto',
      zIndex: 1000
    },
    shopItem: {
      padding: '0.75rem',
      borderBottom: '1px solid #f0f0f0',
      cursor: 'pointer',
      transition: 'all 0.3s',
      borderRadius: '6px',
      marginBottom: '0.5rem'
    },
    legend: {
      position: 'absolute',
      bottom: '1rem',
      left: '1rem',
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 1000
    },
    popupContent: {
      minWidth: '200px'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingOverlay}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
        <h3 style={{ color: '#667eea', margin: '0.5rem 0' }}>Finding Nearby E-Waste Shops...</h3>
        <p style={{ color: '#666', margin: '0.5rem 0' }}>Getting your location and searching for collection points</p>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginTop: '1rem'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show error only if we don't have shops from props and there's an error
  if (error && !propsShops) {
    return (
      <div style={styles.errorContainer}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
        <h3>Location Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Default center if user location is still loading
  // eslint-disable-next-line no-unused-vars
  const defaultCenter = [20.5937, 78.9629]; // Approx center of India

  return (
    <div style={styles.container}>
      {/* Location Search Bar Overlay */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50px', // Avoid overlapping with zoom controls
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '5px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: 'flex',
        gap: '5px'
      }}>
        <form onSubmit={handleLocationSearch} style={{ display: 'flex', gap: '5px' }}>
          <input
            type="text"
            placeholder="Search city or area..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            style={{
              padding: '5px 10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '200px'
            }}
          />
          <button 
            type="submit" 
            disabled={isSearchingLocation}
            style={{
              padding: '5px 10px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isSearchingLocation ? '...' : 'Go'}
          </button>
        </form>
      </div>

      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Handle map movement */}
        <MapFlyTo center={mapCenter} />
        
        {/* User Location Marker */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div style={styles.popupContent}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>📍 Your Location</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                    You are here
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Search radius circle */}
            <Circle
              center={userLocation}
              radius={searchRadius}
              pathOptions={{
                color: '#667eea',
                fillColor: '#667eea',
                fillOpacity: 0.1,
                weight: 2
              }}
            />

            <RecenterMap center={userLocation} />
          </>
        )}

        {/* Shop markers */}
        {shops.filter(shop => shop.location?.coordinates && shop.location.coordinates.length === 2).map((shop) => (
          <Marker 
            key={shop._id} 
            position={[shop.location.coordinates[1], shop.location.coordinates[0]]}
            icon={shopIcon}
            eventHandlers={{
              click: () => navigate(`/shop/${shop._id}`),
              mouseover: (e) => e.target.openTooltip(),
              mouseout: (e) => e.target.closeTooltip()
            }}
          >
            <Tooltip direction="top" offset={[0, -32]} opacity={1}>
              <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#28a745', fontSize: '1rem' }}>
                  🏪 {shop.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                  Click to view details
                </p>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Shop List Sidebar */}
      {shops.length > 0 && (
        <div style={styles.shopList}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#1a252f' }}>
            🏪 Nearby Shops ({shops.length})
          </h4>
          {shops.map((shop) => (
            <div
              key={shop._id}
              style={{
                ...styles.shopItem,
                backgroundColor: 'transparent'
              }}
              onClick={() => navigate(`/shop/${shop._id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#1a252f' }}>
                {shop.name}
              </h5>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>
                {shop.address.substring(0, 50)}...
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={styles.legend}>
        <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#667eea', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.85rem', color: '#555' }}>Your Location</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#28a745', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.85rem', color: '#555' }}>E-Waste Shop</span>
        </div>
        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e0e0e0' }}>
          <span style={{ fontSize: '0.75rem', color: '#999' }}>
            Search Radius: {searchRadius / 1000}km
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;