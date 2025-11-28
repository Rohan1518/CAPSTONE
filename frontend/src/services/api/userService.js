import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

/**
 * @desc    Get leaderboard data (top users by points)
 * @access  Public
 */
const getLeaderboard = async () => {
    try {
        const response = await axios.get(API_URL + 'leaderboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error.response?.data?.message || 'Error fetching leaderboard';
    }
};

/**
 * @desc    Get the logged-in user's challenge progress
 * @access  Private
 */
const getMyChallengeProgress = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await axios.get(API_URL + 'me/challenges', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching user challenge progress:', error);
        throw error.response?.data?.message || 'Error fetching challenge progress';
    }
};

/**
 * @desc    Get the logged-in user's marketplace components
 * @access  Private
 */
const getMyComponents = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await axios.get(API_URL + 'me/components', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching user components:', error);
        throw error.response?.data?.message || 'Error fetching user components';
    }
};

/**
 * @desc    Get the logged-in user's tracking items
 * @access  Private
 */
const getMyTrackingItems = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await axios.get(API_URL + 'me/tracking', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching user tracking items:', error);
        throw error.response?.data?.message || 'Error fetching user tracking items';
    }
};

// --- 👇 NEW FUNCTION ---
/**
 * @desc    Get the logged-in user's sold items
 * @access  Private
 */
const getMySoldItems = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await axios.get(API_URL + 'me/sold', config);
        return response.data; // Should contain { status: 'success', data: { soldItems: [...] } }
    } catch (error) {
        console.error('Error fetching user sold items:', error);
        throw error.response?.data?.message || 'Error fetching user sold items';
    }
};
// --- END NEW FUNCTION ---

// --- 👇 NEW FUNCTION ---
/**
 * @desc    Get the logged-in user's purchased items
 * @access  Private
 */
const getMyPurchasedItems = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await axios.get(API_URL + 'me/purchased', config);
        return response.data; // Should contain { status: 'success', data: { purchasedItems: [...] } }
    } catch (error) {
        console.error('Error fetching user purchased items:', error);
        throw error.response?.data?.message || 'Error fetching user purchased items';
    }
};
// --- END NEW FUNCTION ---

const userService = {
    getLeaderboard,
    getMyChallengeProgress,
    getMyComponents,
    getMyTrackingItems,
    getMySoldItems,     // 👈 Add new function to export
    getMyPurchasedItems,  // 👈 Add new function to export
};

export default userService;