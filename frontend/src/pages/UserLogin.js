import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../store/slices/authSlice';
import authService from '../services/api/authService';
import '../styles/globals.css';

const UserLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(formData);
            
            // Restructure the response to include token at the top level
            const userData = {
                ...response.data.data.user,
                token: response.data.token,
            };

            // Prevent admin from logging in through user portal
            if (userData.role === 'admin') {
                setError('Please use the Admin Portal to login.');
                setLoading(false);
                return;
            }
            
            dispatch(loginSuccess(userData));
            navigate('/dashboard');

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Left Side - Hero Image/Branding */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '4rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '1.5rem' }}>E-Waste Locator</h1>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '500px', color: 'white' }}>
                        Join the movement towards a sustainable future. Find recycling centers, trade components, and track your environmental impact.
                    </p>
                </div>
                {/* Decorative Circle */}
                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                }} />
            </div>

            {/* Right Side - Login Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--surface-color)',
                padding: '2rem'
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '0.5rem' }}>Welcome back</h2>
                        <p>Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FECACA',
                            borderRadius: 'var(--radius-md)',
                            color: '#991B1B',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }} disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 500, textDecoration: 'none' }}>
                                Sign up for free
                            </Link>
                        </div>
                        
                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
                            <Link to="/admin-login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                                Admin Access
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
