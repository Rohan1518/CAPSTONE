import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import trackingService from '../../services/api/trackingService'; // Need the service
import '../../styles/globals.css';

const UpdateTrackingForm = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [newStatus, setNewStatus] = useState('in-transit'); // Default to next logical step
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Get user token from Redux for authentication
    const { user } = useSelector((state) => state.auth);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!trackingNumber || !newStatus) {
            setError('Please enter a tracking number and select a status.');
            setLoading(false);
            return;
        }

        if (!user || !user.token) {
            setError('You must be logged in to update status.');
            setLoading(false);
            return;
        }

        try {
            const updateData = {
                status: newStatus,
                notes: notes, // Include optional notes
            };

            // Call the (yet to be created) update function in trackingService
            // We need to pass the tracking number, the data, and the token
            await trackingService.updateTrackingStatus(trackingNumber, updateData, user.token);

            setSuccess(`Status for ${trackingNumber} updated successfully!`);
            // Clear parts of the form
            setTrackingNumber('');
            setNotes('');
            // Keep newStatus as is, in case updating multiple items

        } catch (err) {
            setError(err.toString() || 'Failed to update status.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2>Update Shipment Status</h2>
            <form onSubmit={onSubmit}>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

                <div className="form-group">
                    <label htmlFor="trackingNumberUpdate">Tracking Number</label>
                    <input
                        type="text"
                        id="trackingNumberUpdate" // Use a unique ID
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g., EW1A2B3C4D"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="newStatus">New Status</label>
                    <select
                        id="newStatus"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        {/* Match the enum values from the backend model */}
                        <option value="in-transit">In Transit</option>
                        <option value="processing">Processing</option>
                        <option value="recycled">Recycled</option>
                        <option value="error">Error</option>
                        <option value="pending-pickup">Pending Pickup</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Notes (Optional)</label>
                    <input
                        type="text"
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g., Arrived at facility"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Status'}
                </button>
            </form>
        </div>
    );
};

export default UpdateTrackingForm;