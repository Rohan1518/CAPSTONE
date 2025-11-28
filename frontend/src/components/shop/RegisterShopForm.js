import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../common/LocationPicker';
import shopService from '../../services/api/shopService'; 
import '../../styles/globals.css';

const RegisterShopForm = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [location, setLocation] = useState(null); // { lat, lng }
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const wasteTypes = [
        'Phones', 'Laptops', 'Tablets', 'Batteries', 'Chargers',
        'Monitors', 'Keyboards', 'Mice', 'Cables', 'Other Electronics'
    ];

    const [selectedWastes, setSelectedWastes] = useState([]);

    const handleWasteToggle = (waste) => {
        setSelectedWastes(prev => 
            prev.includes(waste) 
                ? prev.filter(w => w !== waste)
                : [...prev, waste]
        );
    };

    const handleLocationSelect = (latlng) => {
        setLocation(latlng);
        setError(''); // Clear errors when location is selected
    };

    const resetForm = () => {
        setName('');
        setAddress('');
        setContact('');
        setSelectedWastes([]);
        setLocation(null);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!user || !user.token) {
            setError('You must be logged in to register a shop.');
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
            console.log('📤 Registering shop with data:', shopData);
            console.log('📤 Using token:', user.token.substring(0, 20) + '...');
            
            const response = await shopService.registerShop(shopData, user.token);
            console.log('✅ Shop registered successfully:', response);
            
            setSuccess('🎉 Shop registered successfully! It will now appear on the map.');
            resetForm();
            
            // Redirect to profile after 2 seconds
            setTimeout(() => {
                navigate('/profile');
            }, 2000);

        } catch (err) {
            console.error('❌ Error registering shop:', err);
            console.error('❌ Error response:', err.response);
            setError(err.response?.data?.message || err.message || 'Failed to register shop.');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            maxWidth: '800px',
            margin: '2rem auto',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden'
        },
        header: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            color: 'white',
            textAlign: 'center'
        },
        form: {
            padding: '2rem'
        },
        formGroup: {
            marginBottom: '1.5rem'
        },
        label: {
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#1a252f',
            fontSize: '0.95rem'
        },
        required: {
            color: '#dc3545',
            marginLeft: '0.25rem'
        },
        input: {
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '1rem',
            transition: 'all 0.3s',
            boxSizing: 'border-box'
        },
        textarea: {
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '1rem',
            minHeight: '100px',
            resize: 'vertical',
            transition: 'all 0.3s',
            boxSizing: 'border-box'
        },
        wasteGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '0.75rem',
            marginTop: '0.75rem'
        },
        wasteButton: {
            padding: '0.75rem 1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontSize: '0.9rem',
            fontWeight: '500'
        },
        wasteButtonSelected: {
            backgroundColor: '#667eea',
            color: 'white',
            borderColor: '#667eea'
        },
        alert: {
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '500'
        },
        alertError: {
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb'
        },
        alertSuccess: {
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb'
        },
        submitButton: {
            width: '100%',
            padding: '1rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            marginTop: '1rem'
        },
        submitButtonDisabled: {
            opacity: 0.6,
            cursor: 'not-allowed'
        },
        helpText: {
            fontSize: '0.85rem',
            color: '#6c757d',
            marginTop: '0.5rem'
        },
        icon: {
            marginRight: '0.5rem'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                    🏪 Register Your E-Waste Shop
                </h2>
                <p style={{ margin: 0, opacity: 0.9 }}>
                    Help others find your e-waste collection point
                </p>
            </div>

            <form onSubmit={onSubmit} style={styles.form}>
                {error && (
                    <div style={{...styles.alert, ...styles.alertError}}>
                        ⚠️ {error}
                    </div>
                )}
                {success && (
                    <div style={{...styles.alert, ...styles.alertSuccess}}>
                        {success}
                    </div>
                )}

                {/* Shop Name */}
                <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.label}>
                        <span style={styles.icon}>🏪</span>
                        Shop Name
                        <span style={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Green Electronics Recycling Center"
                        required
                        style={styles.input}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                </div>

                {/* Address */}
                <div style={styles.formGroup}>
                    <label htmlFor="address" style={styles.label}>
                        <span style={styles.icon}>📍</span>
                        Full Address
                        <span style={styles.required}>*</span>
                    </label>
                    <textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter the complete address including street, city, and postal code"
                        required
                        style={styles.textarea}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                </div>

                {/* Contact */}
                <div style={styles.formGroup}>
                    <label htmlFor="contact" style={styles.label}>
                        <span style={styles.icon}>📞</span>
                        Contact Information
                        <span style={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        id="contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Phone number or email address"
                        required
                        style={styles.input}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                    <p style={styles.helpText}>
                        This will be publicly visible to help users contact you
                    </p>
                </div>

                {/* Accepted Waste Types */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        <span style={styles.icon}>♻️</span>
                        Accepted Waste Types
                        <span style={styles.required}>*</span>
                    </label>
                    <p style={styles.helpText}>
                        Select all types of e-waste that your shop accepts
                    </p>
                    <div style={styles.wasteGrid}>
                        {wasteTypes.map((waste) => (
                            <button
                                key={waste}
                                type="button"
                                onClick={() => handleWasteToggle(waste)}
                                style={{
                                    ...styles.wasteButton,
                                    ...(selectedWastes.includes(waste) ? styles.wasteButtonSelected : {})
                                }}
                            >
                                {selectedWastes.includes(waste) && '✓ '}
                                {waste}
                            </button>
                        ))}
                    </div>
                    {selectedWastes.length > 0 && (
                        <p style={{...styles.helpText, color: '#28a745', marginTop: '1rem'}}>
                            ✓ Selected: {selectedWastes.join(', ')}
                        </p>
                    )}
                </div>

                {/* Location Picker */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        <span style={styles.icon}>📍</span>
                        Shop Location
                        <span style={styles.required}>*</span>
                    </label>
                    <p style={styles.helpText}>
                        Search for your address or click on the map to pinpoint your exact location
                    </p>
                    <LocationPicker onLocationSelect={handleLocationSelect} initialPosition={location} />
                    {location && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: '#e7f3ff',
                            borderRadius: '8px',
                            border: '1px solid #b3d9ff'
                        }}>
                            <strong style={{ color: '#007bff' }}>✓ Location Selected:</strong>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#555' }}>
                                Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...styles.submitButton,
                        ...(loading ? styles.submitButtonDisabled : {})
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#5568d3')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#667eea')}
                >
                    {loading ? '⏳ Registering Shop...' : '✓ Register My Shop'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6c757d', fontSize: '0.9rem' }}>
                    By registering, you confirm that the information provided is accurate
                </p>
            </form>
        </div>
    );
};

export default RegisterShopForm;
