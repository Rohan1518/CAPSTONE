import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import achievementService from '../../services/api/achievementService';
import '../../styles/globals.css';

const AddAchievementForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        criteria: '',
        pointsAwarded: 0,
        icon: 'default_badge',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Get user token for authentication
    const { user } = useSelector((state) => state.auth);

    const { name, description, criteria, pointsAwarded, icon } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!name || !description || !criteria) {
            setError('Please fill out Name, Description, and Criteria.');
            setLoading(false);
            return;
        }

        if (!user || !user.token) {
            setError('Authentication error.');
            setLoading(false);
            return;
        }

        try {
            const achievementData = {
                name,
                description,
                criteria,
                pointsAwarded: Number(pointsAwarded) || 0, // Ensure it's a number
                icon,
            };

            await achievementService.createAchievement(achievementData, user.token);

            setSuccess('Achievement created successfully!');
            // Clear the form
            setFormData({
                name: '',
                description: '',
                criteria: '',
                pointsAwarded: 0,
                icon: 'default_badge',
            });

        } catch (err) {
            setError(err.toString() || 'Failed to create achievement.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <h2>Create New Achievement</h2>
            <form onSubmit={onSubmit}>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

                <div className="form-group">
                    <label htmlFor="name">Achievement Name</label>
                    <input type="text" id="name" name="name" value={name} onChange={onChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" name="description" value={description} onChange={onChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="criteria">Criteria (e.g., 'post_count &gt; 5')</label>
                    <input type="text" id="criteria" name="criteria" value={criteria} onChange={onChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="pointsAwarded">Points Awarded (Optional)</label>
                    <input type="number" id="pointsAwarded" name="pointsAwarded" value={pointsAwarded} onChange={onChange} min="0" />
                </div>

                <div className="form-group">
                    <label htmlFor="icon">Icon Name (Optional)</label>
                    <input type="text" id="icon" name="icon" value={icon} onChange={onChange} placeholder="e.g., first_post_badge" />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Achievement'}
                </button>
            </form>
        </div>
    );
};

export default AddAchievementForm;