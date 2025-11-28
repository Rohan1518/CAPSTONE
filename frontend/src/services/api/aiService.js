import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai/';

/**
 * @desc    Send a message to the chatbot backend
 * @access  Private
 */
const askChatbot = async (message, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await axios.post(API_URL + 'chatbot', { message }, config);
        return response.data;
    } catch (error) {
        console.error('Error asking chatbot:', error);
        throw error.response?.data?.message || 'Error communicating with chatbot';
    }
};

// REMOVED: analyzeImage function

const aiService = {
    askChatbot,
    // REMOVED: analyzeImage export
};

export default aiService;