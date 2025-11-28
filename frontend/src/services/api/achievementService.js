import axios from 'axios';

const API_URL = 'http://localhost:5000/api/achievements/';

/**
 * @desc    Get all defined achievements
 * @access  Public
 */
const getAllAchievements = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching achievements:', error);
        throw error.response?.data?.message || 'Error fetching achievements';
    }
};

/**
 * @desc    Create a new achievement definition
 * @access  Private/Admin
 */
const createAchievement = async (achievementData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Requires admin token
            }
        };
        const response = await axios.post(API_URL, achievementData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating achievement:', error);
        throw error.response?.data?.message || 'Error creating achievement';
    }
};

const achievementService = {
    getAllAchievements,
    createAchievement,
    // Functions to check/award achievements will go here later
};

export default achievementService;