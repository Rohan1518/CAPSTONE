import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Make sure useSelector is imported
import locationService from '../../services/api/locationService';
import '../../styles/globals.css'; // Assuming styles are imported

const AddLocationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        type: 'recycling-center', // Default type
        longitude: '',
        latitude: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    // Get user data (including token) from Redux
    const { user } = useSelector((state) => state.auth);

    const { name, address, type, longitude, latitude } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

     // Helper function to reset form fields
    const resetForm = () => {
         setFormData({
            name: '',
            address: '',
            type: 'recycling-center',
            longitude: '',
            latitude: '',
        });
        // You might need to manually clear file input if added later
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true); // Set loading

        // Check for token before submitting
        if (!user || !user.token) {
            setError('Not authorized. Please log in again.');
            setLoading(false);
            return;
        }

        if (!name || !address || !longitude || !latitude) {
            setError('Please fill out all fields.');
             setLoading(false);
            return;
        }

        try {
            const locationData = {
                name,
                address,
                type,
                location: {
                    type: 'Point',
                    // Ensure coordinates are numbers
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                }
            };

            // Pass the token to the service function
            await locationService.createLocation(locationData, user.token);
            setSuccess('Location created successfully!');
            resetForm(); // Clear the form on success

        } catch (err) {
            // Display specific error from backend if available
            setError(err.toString() || 'Failed to create location.');
        } finally {
             setLoading(false); // Stop loading
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2>Add New E-waste Location</h2>
            <form onSubmit={onSubmit}>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

                 <div className="form-group">
                    <label htmlFor="name">Center Name</label>
                    <input type="text" id="name" name="name" value={name} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" value={address} onChange={onChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="type">Location Type</label>
                    <select id="type" name="type" value={type} onChange={onChange}>
                         <option value="recycling-center">Recycling Center</option>
                        <option value="repair-shop">Repair Shop</option>
                        <option value="buyback-center">Buyback Center</option>
                        <option value="e-waste-bin">E-waste Bin</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="longitude">Longitude</label>
                    <input type="number" step="any" id="longitude" name="longitude" value={longitude} onChange={onChange} placeholder="e.g., 78.9629" required />
                </div>
                <div className="form-group">
                    <label htmlFor="latitude">Latitude</label>
                    <input type="number" step="any" id="latitude" name="latitude" value={latitude} onChange={onChange} placeholder="e.g., 20.5937" required />
                </div>


                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Location'}
                </button>
            </form>
        </div>
    );
};

export default AddLocationForm;