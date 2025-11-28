import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../../store/slices/authSlice';
import NotificationCenter from '../communication/NotificationCenter'; // 👈 1. Import the NotificationCenter

const Header = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAdmin = user?.data?.user?.role === 'admin';

    const handleLogout = () => {
        dispatch(logoutSuccess());
        navigate('/'); // Redirect to login page after logout
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        margin: '0 1rem',
        fontWeight: '500',
        padding: '5px 0', // Add padding for easier clicking
    };

    const brandStyle = {
        color: 'white',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.5rem',
    };

    return (
        <header style={{
            backgroundColor: '#1a252f', // Dark background
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
            {/* Brand/Logo */}
            <Link to={isAuthenticated ? "/dashboard" : "/"} style={brandStyle}>
                E-Waste Locator
            </Link>

            {/* Navigation Links */}
            <nav style={{ display: 'flex', alignItems: 'center' }}>
                {isAuthenticated ? (
                    <>
                        {/* Links for logged-in users */}
                        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                        <Link to="/search" style={linkStyle}>Map</Link>
                        <Link to="/marketplace" style={linkStyle}>Marketplace</Link>
                        <Link to="/tracking" style={linkStyle}>Tracking</Link>
                        <Link to="/community" style={linkStyle}>Community</Link>
                        <Link to="/education" style={linkStyle}>Learn</Link>
                        <Link to="/gamification" style={linkStyle}>Gamification</Link>
                        <Link to="/profile" style={linkStyle}>Profile</Link>
                        {isAdmin && (
                            <Link to="/admin" style={linkStyle}>Admin</Link>
                        )}

                        {/* 👇 2. Add the NotificationCenter component */}
                        <NotificationCenter /> 

                        <button onClick={handleLogout} style={{
                            background: 'none',
                            border: '1px solid #dc3545',
                            color: '#dc3545',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            marginLeft: '1rem',
                            cursor: 'pointer',
                            fontWeight: '500',
                             width: 'auto', // Override global button width
                             marginTop: 0 // Override global button margin
                        }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        {/* Links/Buttons for logged-out users (Login/Register are on the root page) */}
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;