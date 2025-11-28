import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import componentService from '../services/api/componentService';
import '../styles/globals.css';

const ComponentDetailsPage = () => {
    const { id } = useParams();
    const [component, setComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const BACKEND_URL = 'http://localhost:5000';

    // Get user data from Redux
    const { user } = useSelector((state) => state.auth);

    // Fetch component data
    const fetchComponent = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await componentService.getComponentById(id);
            setComponent(data.data.component);
            setError('');
        } catch (err) {
            setError('Failed to load component details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchComponent();
    }, [fetchComponent]);

    // --- 👇 NEW FUNCTION ---
    /**
     * @desc    Handles the "Contact Seller" button click
     */
    const handleContactSeller = () => {
        if (!user || !user.token) {
            setError('You must be logged in to view seller details.');
            return;
        }

        if (component.seller._id === user._id) {
             setError('You cannot buy your own item.');
             return;
        }
        
        // Show seller details in an alert or modal
        const sellerName = component.seller.name || 'Unknown';
        const sellerEmail = component.seller.email || 'Not available';
        const sellerContact = component.seller.contactInfo || 'Not provided'; // Assuming contactInfo exists

        alert(`
        📞 Contact Seller
        ----------------
        Name: ${sellerName}
        Email: ${sellerEmail}
        Phone/Contact: ${sellerContact}
        
        Please contact the seller directly to arrange payment and delivery.
        `);
    };
    // --- END NEW FUNCTION ---

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <header style={{
                backgroundColor: '#ffffff',
                padding: '1rem 2rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ color: '#1a252f', margin: 0, fontSize: '1.5rem' }}>
                    Component Details
                </h1>
                <Link to="/marketplace" style={{
                    textDecoration: 'none',
                    color: '#007bff',
                    fontWeight: '600'
                }}>
                    Back to Marketplace
                </Link>
            </header>

            <main style={{ padding: '2rem', maxWidth: '900px', margin: '2rem auto' }}>
                {loading && <p style={{ textAlign: 'center' }}>Loading details...</p>}
                
                {/* Display main error (e.g., fetch error) */}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                
                {!loading && component && (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem', 
                        backgroundColor: '#fff', 
                        padding: '2rem', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        
                        {/* Left Column: Image */}
                        <div>
                            <img
                                src={`${BACKEND_URL}${component.image}`}
                                alt={component.name}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    aspectRatio: '1 / 1',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #eee'
                                }}
                                onError={(e) => {
                                     e.target.onerror = null; 
                                     e.target.src = `${BACKEND_URL}/uploads/default-component.jpg`;
                                }}
                            />
                        </div>

                        {/* Right Column: Details & Bidding */}
                        <div>
                            <h2 style={{ marginTop: 0, color: '#1a252f' }}>{component.name}</h2>
                            
                            <p style={{ 
                                backgroundColor: '#f4f7f6', 
                                display: 'inline-block', 
                                padding: '0.25rem 0.75rem', 
                                borderRadius: '20px', 
                                fontSize: '0.9rem', 
                                fontWeight: '600',
                                color: '#555'
                            }}>
                                Condition: {component.condition}
                            </p>
                            <p style={{ fontSize: '1rem', color: '#444', lineHeight: '1.6' }}>
                                {component.description}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                Seller: {component.seller ? component.seller.name : 'Unknown'}
                            </p>

                            <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #eee' }} />

                            {/* --- Bidding/Buy Section --- */}
                            <div>
                                <h3 style={{ marginBottom: '0.5rem' }}>
                                    Price:
                                </h3>
                                <p style={{ 
                                    fontSize: '2rem', 
                                    fontWeight: 'bold', 
                                    color: '#007bff',
                                    margin: '0 0 1.5rem 0'
                                }}>
                                    ₹{component.currentPrice}
                                </p>
                                
                                {/* Display Buy Now Button */}
                                {component.status === 'available' && (
                                    <button 
                                        onClick={handleContactSeller} // 👈 Attach handler
                                        style={{width: '100%', backgroundColor: '#28a745', marginTop: 0}}
                                    >
                                        📞 Contact Seller to Buy
                                    </button>
                                )}

                                {/* Display Sold Message */}
                                {component.status === 'sold' && (
                                    <p style={{color: '#dc3545', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center'}}>
                                        This item has been sold.
                                    </p>
                                )}
                                
                                {/* Display buy error */}
                                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                            </div>
                            {/* --- End Bidding Section --- */}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ComponentDetailsPage;