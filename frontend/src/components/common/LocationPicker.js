import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to update map view when position changes
const MapUpdater = ({ position }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position && typeof position.lat === 'number' && typeof position.lng === 'number') {
      const target = [position.lat, position.lng];
      console.log('Flying to:', target);
      
      // Use flyTo for smooth animation
      map.flyTo(target, 16, {
        animate: true,
        duration: 1.5
      });
    }
  }, [position, map]);
  
  return null;
};

// Define outside to prevent re-mounting issues
const LocationMarker = ({ position, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <strong>Selected Location</strong><br />
        Lat: {position.lat.toFixed(6)}<br />
        Lng: {position.lng.toFixed(6)}
      </Popup>
    </Marker>
  );
};

const LocationPicker = ({ onLocationSelect, initialPosition = null }) => {
  const [position, setPosition] = useState(initialPosition);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Sync with prop changes
  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation && !initialPosition) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setUserLocation(userPos);
          if (!position) {
            setPosition(userPos);
            onLocationSelect(userPos);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // Geocoding search using Nominatim API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResults([]);
    setHasSearched(false);

    try {
      console.log('Searching for:', searchQuery);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      console.log('Search results:', data);
      setSearchResults(data);
      setHasSearched(true);

      // Auto-navigate to the first result
      if (data && data.length > 0) {
        const firstResult = data[0];
        const newPos = {
          lat: parseFloat(firstResult.lat),
          lng: parseFloat(firstResult.lon)
        };
        console.log('Auto-selecting first result:', newPos);
        
        // Update local state immediately
        setPosition(newPos);
        
        // Notify parent
        onLocationSelect(newPos);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search for location. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleResultClick = (result) => {
    const newPos = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon)
    };
    setPosition(newPos);
    onLocationSelect(newPos);
    setSearchResults([]);
    setSearchQuery(result.display_name);
  };

  const handleUseMyLocation = () => {
    if (userLocation) {
      setPosition(userLocation);
      onLocationSelect(userLocation);
    } else {
      alert('Unable to get your location. Please enable location services.');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Search Bar */}
      <div style={{
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(e);
              }
            }}
            placeholder="Search for an address or place..."
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #ced4da',
              borderRadius: '6px',
              fontSize: '0.95rem'
            }}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: searching ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: searching ? 0.7 : 1
            }}
          >
            {searching ? '🔍 Searching...' : '🔍 Search'}
          </button>
          <button
            type="button"
            onClick={handleUseMyLocation}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            📍 My Location
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 ? (
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            marginTop: '0.5rem'
          }}>
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleResultClick(result)}
                style={{
                  padding: '0.75rem',
                  borderBottom: index < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                <strong>📍 {result.display_name}</strong>
              </div>
            ))}
          </div>
        ) : hasSearched && !searching && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fff3cd',
            color: '#856404',
            border: '1px solid #ffeeba',
            borderRadius: '6px',
            marginTop: '0.5rem',
            textAlign: 'center'
          }}>
            ⚠️ No location found for "{searchQuery}". Please try a different name.
          </div>
        )}

        <p style={{
          margin: '0.5rem 0 0 0',
          fontSize: '0.85rem',
          color: '#6c757d'
        }}>
          💡 Click on the map to place a marker or search for your address above
        </p>
      </div>

      {/* Map */}
      <div style={{
        border: '2px solid #dee2e6',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <MapContainer
          center={position || userLocation || [20.5937, 78.9629]}
          zoom={position ? 15 : 5}
          style={{ height: '450px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker position={position} onLocationSelect={(latlng) => {
            setPosition(latlng);
            onLocationSelect(latlng);
          }} />
          <MapUpdater position={position} />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;