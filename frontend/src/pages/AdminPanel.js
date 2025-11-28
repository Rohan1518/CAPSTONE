import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LocationPicker from '../components/common/LocationPicker';

const AdminPanel = () => {
  const { user: reduxUser } = useSelector((state) => state.auth);
  // Fallback to localStorage if Redux state is not available
  const [user, setUser] = useState(reduxUser || JSON.parse(localStorage.getItem('user')));
  
  const [activeTab, setActiveTab] = useState('shops');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Shops Management
  const [shops, setShops] = useState([]);
  const [shopForm, setShopForm] = useState({
    name: '',
    address: '',
    contact: '',
    email: '',
    openingHours: '',
    acceptedWastes: [],
    location: null
  });
  const [editingShop, setEditingShop] = useState(null);
  
  // Listed Components (by users)
  const [userComponents, setUserComponents] = useState([]);

  // Update user from Redux when it changes
  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
    } else {
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (localUser) {
        setUser(localUser);
      }
    }
  }, [reduxUser]);

  // Check if user is authenticated
  useEffect(() => {
    if (!user || !user.token) {
      setErrorMessage('Please log in as admin to access this panel');
      return;
    }
    if (user.role !== 'admin') {
      setErrorMessage('Access denied. Admin privileges required.');
      return;
    }
    // Clear error if user is valid
    setErrorMessage('');
  }, [user]);
  
  const wasteCategories = [
    'Phones', 'Laptops', 'Tablets', 'Batteries', 'Chargers',
    'Monitors', 'Keyboards', 'Mice', 'Cables', 'Printers',
    'TVs', 'Cameras', 'Other Electronics'
  ];

  useEffect(() => {
    if (user && user.token && user.role === 'admin') {
      fetchShops();
      fetchUserComponents();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const { data } = await axios.get('http://localhost:5000/api/shops', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log('Fetched shops:', data);
      setShops(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setErrorMessage(error.response?.data?.message || 'Error fetching shops');
      setLoading(false);
    }
  };

  const fetchUserComponents = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/components', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUserComponents(data.data?.components || []);
    } catch (error) {
      console.error('Error fetching user components:', error);
    }
  };

  const handleShopSubmit = async (e) => {
    e.preventDefault();
    
    if (!shopForm.name || !shopForm.address || !shopForm.contact) {
      setErrorMessage('Please fill in all required fields: Name, Address, and Contact Number');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (!shopForm.location || !shopForm.location.lat || !shopForm.location.lng) {
      alert('Please select a location on the map by clicking on it');
      return;
    }

    if (shopForm.acceptedWastes.length === 0) {
      alert('Please select at least one e-waste type');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      
      const shopData = {
        ...shopForm,
        location: {
          type: 'Point',
          coordinates: [shopForm.location.lng, shopForm.location.lat]
        }
      };

      console.log('Submitting shop data:', shopData);

      if (editingShop) {
        const response = await axios.put(`http://localhost:5000/api/shops/${editingShop._id}`, shopData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        console.log('Update response:', response.data);
        alert('Shop updated successfully!');
      } else {
        const response = await axios.post('http://localhost:5000/api/shops', shopData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        console.log('Create response:', response.data);
        alert('Shop created successfully!');
      }
      
      setShopForm({
        name: '', address: '', contact: '', email: '', openingHours: '',
        acceptedWastes: [], location: null
      });
      setEditingShop(null);
      setLoading(false);
      fetchShops();
    } catch (error) {
      console.error('Error saving shop:', error);
      setLoading(false);
      alert(error.response?.data?.message || 'Error saving shop. Please try again.');
    }
  };

  const deleteShop = async (shopId) => {
    if (!window.confirm('Are you sure you want to delete this shop?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/shops/${shopId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Shop deleted successfully!');
      fetchShops();
    } catch (error) {
      alert('Error deleting shop');
    }
  };

  const deleteUserComponent = async (componentId) => {
    if (!window.confirm('Are you sure you want to delete this user listing?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/components/${componentId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Component deleted successfully!');
      fetchUserComponents();
    } catch (error) {
      alert('Error deleting component');
    }
  };

  const toggleWasteType = (waste) => {
    setShopForm(prev => ({
      ...prev,
      acceptedWastes: prev.acceptedWastes.includes(waste)
        ? prev.acceptedWastes.filter(w => w !== waste)
        : [...prev.acceptedWastes, waste]
    }));
  };

  const styles = {
    container: {
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '2rem'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      borderRadius: '16px',
      color: 'white',
      marginBottom: '2rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    },
    tabs: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    },
    tab: {
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'all 0.3s'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      marginBottom: '2rem'
    },
    input: {
      width: '100%',
      padding: '0.875rem',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '1rem',
      marginBottom: '1rem',
      transition: 'all 0.3s',
      boxSizing: 'border-box'
    },
    button: {
      padding: '1rem 2rem',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    shopCard: {
      backgroundColor: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '1rem',
      border: '2px solid #e0e0e0'
    }
  };

  return (
    <div style={styles.container}>
      {/* Debug Info */}
      {user && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          ✓ Logged in as: <strong>{user.name}</strong> ({user.role}) | Shops loaded: <strong>{shops.length}</strong>
        </div>
      )}
      
      {errorMessage && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          <strong>⚠️ Error:</strong> {errorMessage}
        </div>
      )}
      
      {loading && (
        <div style={{
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #bee5eb'
        }}>
          <strong>⏳ Loading...</strong> Please wait
        </div>
      )}
      
      <div style={styles.header}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🏪 Admin Control Panel</h1>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
          Manage shops, inventory, and user listings
        </p>
      </div>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('shops')}
          style={{
            ...styles.tab,
            backgroundColor: activeTab === 'shops' ? '#667eea' : 'white',
            color: activeTab === 'shops' ? 'white' : '#333'
          }}
        >
          🏪 Manage Shops
        </button>
        <button
          onClick={() => setActiveTab('components')}
          style={{
            ...styles.tab,
            backgroundColor: activeTab === 'components' ? '#667eea' : 'white',
            color: activeTab === 'components' ? 'white' : '#333'
          }}
        >
          📦 User Listings
        </button>
        <button
          onClick={() => setActiveTab('map')}
          style={{
            ...styles.tab,
            backgroundColor: activeTab === 'map' ? '#667eea' : 'white',
            color: activeTab === 'map' ? 'white' : '#333'
          }}
        >
          🗺️ View All Locations
        </button>
      </div>

      {/* Shops Management Tab */}
      {activeTab === 'shops' && (
        <>
          <div style={styles.card}>
            <h2 style={{ marginTop: 0 }}>
              {editingShop ? 'Edit Shop' : 'Create New Shop'}
            </h2>
            <form onSubmit={handleShopSubmit}>
              <input
                type="text"
                placeholder="Shop Name *"
                value={shopForm.name}
                onChange={(e) => setShopForm({...shopForm, name: e.target.value})}
                style={styles.input}
                required
              />
              <textarea
                placeholder="Full Address *"
                value={shopForm.address}
                onChange={(e) => setShopForm({...shopForm, address: e.target.value})}
                style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
                required
              />
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Contact Number <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={shopForm.contact}
                  onChange={(e) => setShopForm({...shopForm, contact: e.target.value})}
                  style={{
                    ...styles.input,
                    borderColor: !shopForm.contact && errorMessage ? '#dc3545' : '#e0e0e0'
                  }}
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={shopForm.email}
                onChange={(e) => setShopForm({...shopForm, email: e.target.value})}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Opening Hours (e.g., Mon-Fri: 9AM-6PM)"
                value={shopForm.openingHours}
                onChange={(e) => setShopForm({...shopForm, openingHours: e.target.value})}
                style={styles.input}
              />

              <h3>Accepted E-Waste Types *</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                {wasteCategories.map(waste => (
                  <label key={waste} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem',
                    backgroundColor: shopForm.acceptedWastes.includes(waste) ? '#e7f3ff' : '#f8f9fa',
                    border: `2px solid ${shopForm.acceptedWastes.includes(waste) ? '#667eea' : '#e0e0e0'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={shopForm.acceptedWastes.includes(waste)}
                      onChange={() => toggleWasteType(waste)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {waste}
                  </label>
                ))}
              </div>

              <h3>Shop Location on Map *</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Click anywhere on the map to set the shop location
                {shopForm.location && (
                  <span style={{ color: '#28a745', fontWeight: '600', marginLeft: '0.5rem' }}>
                    ✓ Location selected: {shopForm.location.lat.toFixed(6)}, {shopForm.location.lng.toFixed(6)}
                  </span>
                )}
              </p>
              <div style={{ marginBottom: '1rem', border: '2px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', height: '400px' }}>
                <LocationPicker 
                  onLocationSelect={(loc) => {
                    console.log('Location selected:', loc);
                    setShopForm({...shopForm, location: loc});
                  }}
                  initialPosition={shopForm.location}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button 
                  type="submit" 
                  style={{
                    ...styles.button,
                    flex: 1,
                    fontSize: '1.1rem',
                    padding: '1.25rem 2rem',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}
                  disabled={loading}
                >
                  {loading ? '⏳ Processing...' : (editingShop ? '✓ Update Shop' : '+ Create Shop')}
                </button>
                {editingShop && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingShop(null);
                      setShopForm({
                        name: '', address: '', contact: '', email: '', openingHours: '',
                        acceptedWastes: [], location: null
                      });
                    }}
                    style={{
                      ...styles.button, 
                      backgroundColor: '#6c757d',
                      boxShadow: '0 4px 12px rgba(108, 117, 125, 0.3)'
                    }}
                    disabled={loading}
                  >
                    ✕ Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={styles.card}>
            <h2>Existing Shops ({shops.length})</h2>
            {shops.map(shop => (
              <div key={shop._id} style={styles.shopCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>{shop.name}</h3>
                    <p style={{ margin: '0.25rem 0' }}>📍 {shop.address}</p>
                    <p style={{ margin: '0.25rem 0' }}>📞 {shop.contact}</p>
                    {shop.email && <p style={{ margin: '0.25rem 0' }}>✉️ {shop.email}</p>}
                    {shop.openingHours && <p style={{ margin: '0.25rem 0' }}>🕐 {shop.openingHours}</p>}
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                      Accepts: {shop.acceptedWastes?.join(', ') || 'N/A'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setEditingShop(shop);
                        setShopForm({
                          name: shop.name,
                          address: shop.address,
                          contact: shop.contact,
                          email: shop.email || '',
                          openingHours: shop.openingHours || '',
                          acceptedWastes: shop.acceptedWastes || [],
                          location: shop.location?.coordinates ? {
                            lat: shop.location.coordinates[1],
                            lng: shop.location.coordinates[0]
                          } : null
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#ffc107',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteShop(shop._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* User Components Tab */}
      {activeTab === 'components' && (
        <div style={styles.card}>
          <h2>User Listed Components ({userComponents.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {userComponents.map(component => (
              <div key={component._id} style={styles.shopCard}>
                {component.image && (
                  <img
                    src={`http://localhost:5000${component.image}`}
                    alt={component.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                  />
                )}
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{component.name}</h3>
                <p style={{ color: '#28a745', fontWeight: '600', fontSize: '1.25rem', margin: '0.5rem 0' }}>
                  ${component.price}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>
                  {component.description}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#999' }}>
                  Seller: {component.seller?.name || 'Unknown'}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#999' }}>
                  Status: {component.status}
                </p>
                <button
                  onClick={() => deleteUserComponent(component._id)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '1rem'
                  }}
                >
                  Delete Listing
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map View Tab */}
      {activeTab === 'map' && (
        <div style={styles.card}>
          <h2>All Shop Locations</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            View all registered shops on the map. <Link to="/search" style={{ color: '#667eea' }}>Go to full map view →</Link>
          </p>
          <div style={{ height: '600px', border: '2px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
            <LocationPicker onLocationSelect={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
