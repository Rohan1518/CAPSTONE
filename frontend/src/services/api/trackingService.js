import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tracking/';

/**
 * @desc    Create a new tracking entry
 * @access  Private
 */
const createTracking = async (trackingData, token) => {
    try {
        // 🐛 DEBUG: Log what we're sending
        console.log('📤 createTracking called with token:', token ? token.substring(0, 20) + '...' : 'UNDEFINED');
        console.log('📤 Token type:', typeof token);
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        };
        
        console.log('📤 Authorization header will be:', config.headers.Authorization.substring(0, 30) + '...');
        
        const response = await axios.post(API_URL, trackingData, config);
        return response.data;
    } catch (error) {
        console.error('❌ Error creating tracking entry:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Error creating entry';
    }
};

/**
 * @desc    Get tracking status by number
 * @access  Public
 */
const getTrackingStatus = async (trackingNumber) => {
    try {
        const response = await axios.get(API_URL + trackingNumber);
        return response.data;
    } catch (error) {
        console.error('Error fetching tracking status:', error);
        throw error.response?.data?.message || 'Tracking number not found';
    }
};

/**
 * @desc    Update tracking status
 * @access  Private
 */
const updateTrackingStatus = async (trackingNumber, updateData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        };
        // Use axios.put for updates, include trackingNumber in the URL
        const response = await axios.put(API_URL + trackingNumber, updateData, config);
        return response.data;
    } catch (error) {
        console.error('Error updating tracking status:', error);
        throw error.response?.data?.message || 'Error updating status';
    }
};

/**
 * @desc    Get blockchain verification status for a tracking number
 * @access  Public
 */
const getChainVerification = async (trackingNumber) => {
    try {
        // Call the backend endpoint
        const response = await axios.get(`${API_URL}${trackingNumber}/verify-chain`);
        return response.data; // Will contain { isVerified: boolean, details: object | null }
    } catch (error) {
        console.error('Error fetching chain verification:', error);
        throw error.response?.data?.message || 'Error fetching verification';
    }
};


const trackingService = {
    createTracking,
    getTrackingStatus,
    updateTrackingStatus,
    getChainVerification, // Ensure this is included
};

export default trackingService;