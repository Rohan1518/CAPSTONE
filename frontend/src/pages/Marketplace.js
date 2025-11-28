import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector
import componentService from '../services/api/componentService';
import { Link } from 'react-router-dom';
import PriceCalculator from '../components/marketplace/PriceCalculator'; 
import '../styles/globals.css';

const Marketplace = () => {
    const { user } = useSelector((state) => state.auth); // Get user from Redux
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Dynamic Backend URL
    const BACKEND_URL = typeof window !== 'undefined' 
        ? `${window.location.protocol}//${window.location.hostname}:5000`
        : 'http://localhost:5000';

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                setLoading(true);
                const data = await componentService.getComponents();
                setComponents(data.data.components || []);
                setError('');
            } catch (err) {
                setError('Failed to load components. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchComponents();
    }, []);

    const handleDelete = async (e, componentId) => {
        e.preventDefault(); // Prevent navigation to details page
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await componentService.deleteComponent(componentId, user.token);
                // Remove from state
                setComponents(components.filter(c => c._id !== componentId));
            } catch (err) {
                alert(err);
            }
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <header style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '2rem',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
                        🛒 E-Waste Marketplace
                    </h1>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                        Buy and sell e-waste components
                    </p>
                </div>
                <Link to="/list-item" style={{
                    textDecoration: 'none',
                    color: '#667eea',
                    backgroundColor: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: '2px solid white',
                    transition: 'all 0.3s'
                }}>
                    + List an Item
                </Link>
            </header>

            <main style={{ padding: '2rem' }}>
            
                {/* 👇 2. Add the PriceCalculator component */}
                <PriceCalculator />

                <hr style={{ margin: '3rem 0', border: 'none', borderTop: '1px solid #ccc' }} />

                <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Available Items</h2>

                {loading && <p style={{ textAlign: 'center' }}>Loading components...</p>}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <div className="marketplace-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {!loading && !error && components.length === 0 && (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#666' }}>
                            No components listed yet. Be the first!
                        </p>
                    )}

                    {!loading && !error && components.map(component => (
                        <Link 
                            to={`/component/${component._id}`} 
                            key={component._id} 
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="component-card" style={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                             onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                            }}
                            >
                                <img
                                    src={`${BACKEND_URL}${component.image}`}
                                    alt={component.name}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderBottom: '1px solid #eee'
                                    }}
                                    onError={(e) => {
                                         e.target.onerror = null;
                                         e.target.src = `${BACKEND_URL}/uploads/default-component.jpg`;
                                    }}
                                />
                                <div style={{ padding: '1.5rem', flexGrow: 1 }}>
                                    <h3 style={{ marginTop: 0, color: '#1a252f' }}>{component.name}</h3>
                                    <p style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        color: '#007bff',
                                        margin: '0.5rem 0'
                                    }}>
                                        ₹{component.currentPrice}
                                    </p>
                                    <p style={{
                                        backgroundColor: '#f4f7f6',
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: '#555'
                                    }}>
                                        Condition: {component.condition}
                                    </p>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.75rem' }}>
                                        Seller: {component.seller ? component.seller.name : 'Unknown'}
                                    </p>
                                    
                                    {user && component.seller && user._id === component.seller._id ? (
                                        <button 
                                            onClick={(e) => handleDelete(e, component._id)}
                                            style={{
                                                marginTop: '1rem',
                                                width: '100%',
                                                padding: '0.75rem',
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                                        >
                                            Delete Item
                                        </button>
                                    ) : (
                                        <button style={{
                                            marginTop: '1rem',
                                            width: '100%',
                                            padding: '0.75rem',
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                                        >
                                            View Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Marketplace;