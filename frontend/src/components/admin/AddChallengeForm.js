import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import challengeService from '../../services/api/challengeService';
import '../../styles/globals.css';

const AddChallengeForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goalType: 'post_count',
        goalValue: 1,
        rewardPoints: 10,
        isActive: true,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => state.auth);

    const { title, description, goalType, goalValue, rewardPoints, isActive } = formData;

    const onChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!title || !description || !goalType || !goalValue) {
            setError('Please fill out all required fields.');
            setLoading(false);
            return;
        }

        if (!user || !user.token) {
            setError('Not authorized. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const challengeData = {
                title,
                description,
                goal: {
                    type: goalType,
                    value: Number(goalValue),
                },
                rewardPoints: Number(rewardPoints),
                isActive,
            };

            await challengeService.createChallenge(challengeData, user.token);

            setSuccess('Challenge created successfully!');
            setFormData({
                title: '',
                description: '',
                goalType: 'post_count',
                goalValue: 1,
                rewardPoints: 10,
                isActive: true,
            });

        } catch (err) {
            setError(err.toString() || 'Failed to create challenge.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <h2>Create New Challenge</h2>
            <form onSubmit={onSubmit}>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

                <div className="form-group">
                    <label htmlFor="title">Challenge Title</label>
                    <input type="text" id="title" name="title" value={title} onChange={onChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" name="description" value={description} onChange={onChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="goalType">Goal Type (e.g., 'post_count')</label>
                    <input type="text" id="goalType" name="goalType" value={goalType} onChange={onChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="goalValue">Goal Value (Target Number)</label>
                    <input type="number" id="goalValue" name="goalValue" value={goalValue} onChange={onChange} min="1" required />
                </div>

                <div className="form-group">
                    <label htmlFor="rewardPoints">Reward Points</label>
                    <input type="number" id="rewardPoints" name="rewardPoints" value={rewardPoints} onChange={onChange} min="0" />
                </div>
                
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={isActive}
                        onChange={onChange}
                        style={{ width: 'auto', height: 'auto', margin: 0 }}
                    />
                    <label htmlFor="isActive" style={{ margin: 0 }}>Challenge is Active</label>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Challenge'}
                </button>
            </form>
        </div>
    );
};

export default AddChallengeForm; // Make sure this line exists