import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../store/slices/authSlice';
import authService from '../services/api/authService';
import '../styles/globals.css';

const AdminLogin = () => {
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

            // Check if user is actually an admin
            if (userData.role !== 'admin') {
                setError('Access denied. Admin credentials required.');
                setLoading(false);
                return;
            }
            
            dispatch(loginSuccess(userData));
            navigate('/admin-dashboard');

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#111827', /* Dark background for Admin */
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '0', overflow: 'hidden', border: 'none' }}>
                {/* Header */}
                <div style={{
                    backgroundColor: '#1F2937',
                    padding: '2rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #374151'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                    <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Admin Portal</h2>
                    <p style={{ color: '#9CA3AF', margin: 0 }}>Secure access only</p>
                </div>

                {/* Form */}
                <div style={{ padding: '2rem', backgroundColor: 'white' }}>
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
                                placeholder="admin@example.com"
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
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#1F2937' }}>
                            {loading ? 'Verifying...' : 'Access Dashboard'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link to="/" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem' }}>
                            ← Back to User Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;