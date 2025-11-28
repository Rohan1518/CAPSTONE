import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';
import authService from '../../services/api/authService';

const RegisterForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { name, email, password } = formData;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // Register the user
            const response = await authService.register(formData);
            
            // ✅ FIX: Restructure the response to include token at the top level
            const userData = {
                ...response.data.data.user, // Spread user properties
                token: response.data.token,  // Add token to user object
            };
            
            // Dispatch the successful login action with the user data
            dispatch(loginSuccess(userData));
            
            alert('Registration successful! You are now logged in.');
            
            // Redirect the user to the dashboard
            navigate('/dashboard'); 

        } catch (error) {
            alert('Registration failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="form-container">
            <h2>Create Account</h2>
            <form onSubmit={onSubmit}>
                {/* ... form inputs are the same ... */}
                <div className="form-group"><label htmlFor="name">Name</label><input type="text" id="name" name="name" value={name} onChange={onChange} required /></div>
                <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" name="email" value={email} onChange={onChange} required /></div>
                <div className="form-group"><label htmlFor="password">Password</label><input type="password" id="password" name="password" value={password} onChange={onChange} required /></div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};
export default RegisterForm;