import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import componentService from '../services/api/componentService';
import '../styles/globals.css';

const ListItemPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    condition: 'used',
    category: 'Phones'
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const itemTypes = [
    'Phones', 'Laptops', 'Tablets', 'Batteries', 'Chargers',
    'Monitors', 'Keyboards', 'Mice', 'Cables', 'Other Electronics'
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'refurbished', label: 'Refurbished' },
    { value: 'for-parts', label: 'For Parts' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.price) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('condition', formData.condition);
      // data.append('category', formData.category); // Backend might not have category yet, but good to send
      if (image) {
        data.append('image', image);
      }

      await componentService.createComponent(data, user.token);
      navigate('/marketplace');
    } catch (err) {
      console.error(err);
      setError(typeof err === 'string' ? err : 'Failed to list item');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      backgroundColor: '#f4f7f6',
      minHeight: '100vh',
      paddingBottom: '2rem'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      color: 'white',
      marginBottom: '2rem'
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
      transition: 'all 0.3s'
    },
    formContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '6px',
      border: '1px solid #ddd',
      fontSize: '1rem'
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '6px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      backgroundColor: 'white'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '6px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical'
    },
    submitButton: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.headerTitle}>Sell Your E-Waste</h1>
            <p style={styles.headerSubtitle}>List your items for others to buy or recycle</p>
          </div>
          <Link to="/marketplace" style={styles.backButton}>
            ← Back to Marketplace
          </Link>
        </div>
      </header>

      <div style={styles.formContainer}>
        <div style={styles.card}>
          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '6px',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Item Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. iPhone 11 Pro Max"
                style={styles.input}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={styles.select}
                >
                  {itemTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Condition *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  style={styles.select}
                >
                  {conditions.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item's condition, specs, etc."
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ ...styles.input, padding: '0.5rem' }}
              />
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? 'Listing Item...' : 'List Item for Sale'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListItemPage;
