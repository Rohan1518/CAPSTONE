import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import shopService from '../../services/api/shopService';
import LocationPicker from '../common/LocationPicker';
import '../../styles/globals.css';

const AddShopForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState(null);
  const [selectedWastes, setSelectedWastes] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const wasteTypes = [
    'Phones', 'Laptops', 'Tablets', 'Batteries', 'Chargers',
    'Monitors', 'Keyboards', 'Mice', 'Cables', 'Other Electronics'
  ];

  const handleWasteToggle = (waste) => {
    setSelectedWastes(prev => 
      prev.includes(waste) 
        ? prev.filter(w => w !== waste)
        : [...prev, waste]
    );
  };

  const handleLocationSelect = (latlng) => {
    setLocation(latlng);
    setError('');
  };

  const resetForm = () => {
    setName('');
    setAddress('');
    setContact('');
    setSelectedWastes([]);
    setLocation(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user || !user.token) {
      setError('You must be logged in as admin.');
      return;
    }

    if (!name || !address || !contact) {
      setError('Please fill in all required fields.');
      return;
    }

    if (selectedWastes.length === 0) {
      setError('Please select at least one accepted waste type.');
      return;
    }

    if (!location) {
      setError('Please select a location on the map.');
      return;
    }

    setLoading(true);

    const shopData = {
      name,
      address,
      contact,
      acceptedWastes: selectedWastes,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat],
      }
    };

    try {
      await shopService.registerShop(shopData, user.token);
      setSuccess('✅ Shop added successfully! It will now appear on the map.');
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add shop.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1a252f',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#333',
      fontSize: '0.95rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '2px solid #e0e0e0',
      fontSize: '1rem',
      transition: 'border-color 0.3s'
    },
    wasteGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '0.75rem',
      marginTop: '1rem'
    },
    wasteButton: {
      padding: '0.75rem',
      borderRadius: '8px',
      border: '2px solid #e0e0e0',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '0.9rem',
      fontWeight: '600',
      textAlign: 'center'
    },
    wasteButtonSelected: {
      backgroundColor: '#667eea',
      color: 'white',
      borderColor: '#667eea'
    },
    submitButton: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 4px 12px rgba(40,167,69,0.3)'
    },
    message: {
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontWeight: '600'
    },
    success: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        🏪 Add E-Waste Shop to Map
      </h2>

      {success && <div style={{ ...styles.message, ...styles.success }}>{success}</div>}
      {error && <div style={{ ...styles.message, ...styles.error }}>⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Shop Name *</label>
          <input
            type="text"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Green Tech Recycling Center"
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Address *</label>
          <input
            type="text"
            style={styles.input}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="E.g., 123 Main Street, City"
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Contact (Phone/Email) *</label>
          <input
            type="text"
            style={styles.input}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="E.g., +1234567890 or email@example.com"
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Accepted Waste Types *</label>
          <div style={styles.wasteGrid}>
            {wasteTypes.map((waste) => (
              <button
                key={waste}
                type="button"
                style={{
                  ...styles.wasteButton,
                  ...(selectedWastes.includes(waste) ? styles.wasteButtonSelected : {})
                }}
                onClick={() => handleWasteToggle(waste)}
              >
                {waste}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Shop Location on Map *</label>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
            Click on the map to mark the shop location, or search for an address
          </p>
          <LocationPicker onLocationSelect={handleLocationSelect} />
        </div>

        <button
          type="submit"
          style={styles.submitButton}
          disabled={loading}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#218838';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#28a745';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {loading ? '⏳ Adding Shop...' : '✅ Add Shop to Map'}
        </button>
      </form>
    </div>
  );
};

export default AddShopForm;
