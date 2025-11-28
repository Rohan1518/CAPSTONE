import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // 1. Import useDispatch
import { useNavigate } from 'react-router-dom'; // 2. Import useNavigate
import { loginSuccess } from '../../store/slices/authSlice'; // 3. Import the action
import authService from '../../services/api/authService';

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;

    const dispatch = useDispatch(); // 4. Initialize dispatch
    const navigate = useNavigate(); // 5. Initialize navigate

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the login function from our service
            const response = await authService.login(formData);
            
            // ✅ FIX: Restructure the response to include token at the top level
            const userData = {
                ...response.data.data.user, // Spread user properties
                token: response.data.token,  // Add token to user object
            };
            
            // 6. Dispatch the successful login action with the user data
            dispatch(loginSuccess(userData)); 
            
            alert('Success! You are now logged in.');
            
            // 7. Redirect the user to a dashboard page
            navigate('/dashboard'); 

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            alert(errorMessage);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                {/* ... form inputs are the same ... */}
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={onChange} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;