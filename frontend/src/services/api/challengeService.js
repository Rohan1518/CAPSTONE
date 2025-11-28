import axios from 'axios';

const API_URL = 'http://localhost:5000/api/challenges/';

/**
 * @desc    Get all active challenge definitions
 * @access  Public
 */
const getAllChallenges = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // Should contain { status: 'success', results: ..., data: { challenges: [...] } }
    } catch (error) {
        console.error('Error fetching challenges:', error);
        throw error.response?.data?.message || 'Error fetching challenges';
    }
};

/**
 * @desc    Create a new challenge definition
 * @access  Private/Admin
 */
const createChallenge = async (challengeData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Requires admin token
            }
        };
        const response = await axios.post(API_URL, challengeData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating challenge:', error);
        throw error.response?.data?.message || 'Error creating challenge';
    }
};

// Add functions later for getting user progress, etc.
// const getUserChallengeProgress = async (token) => { ... }

const challengeService = {
    getAllChallenges,
    createChallenge,
};

export default challengeService;