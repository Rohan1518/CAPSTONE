import axios from 'axios';

// Dynamic API URL based on current window location
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        return `${protocol}//${hostname}:5000`;
    }
    return 'http://localhost:5000';
};

const API_URL = `${getBaseUrl()}/api/components/`;

/**
 * @desc    Get all available components
 * @access  Public
 */
const getComponents = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching components:', error);
        throw error.response?.data?.message || 'Error fetching components';
    }
};

/**
 * @desc    Get a single component by its ID
 * @access  Public
 */
const getComponentById = async (componentId) => {
    try {
        const response = await axios.get(API_URL + componentId);
        return response.data;
    } catch (error) {
        console.error('Error fetching component by ID:', error);
        throw error.response?.data?.message || 'Error fetching component';
    }
};

/**
 * @desc    Create a new component (handles FormData for image)
 * @access  Private
 */
const createComponent = async (formData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await axios.post(API_URL, formData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating component:', error);
        throw error.response?.data?.message || 'Error creating component';
    }
};

/**
 * @desc    Place a bid on a component
 * @access  Private
 */
const placeBid = async (componentId, amount, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await axios.post(
            `${API_URL}${componentId}/bid`,
            { amount },
            config
        );
        return response.data;
    } catch (error) {
        console.error('Error placing bid:', error);
        throw error.response?.data?.message || 'Error placing bid';
    }
};

// --- 👇 NEW FUNCTION ---
/**
 * @desc    Buy an item directly
 * @access  Private
 */
const buyItemNow = async (componentId, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Send auth token
            }
        };
        // Send POST request to the /buy endpoint. No body data is needed.
        const response = await axios.post(
            `${API_URL}${componentId}/buy`,
            {}, // Send an empty object as the body
            config
        );
        return response.data; // Returns the updated (sold) component
    } catch (error) {
        console.error('Error buying item:', error);
        throw error.response?.data?.message || 'Error buying item';
    }
};

/**
 * @desc    Delete a component
 * @access  Private
 */
const deleteComponent = async (componentId, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await axios.delete(`${API_URL}${componentId}`, config);
        return response.data;
    } catch (error) {
        console.error('Error deleting component:', error);
        throw error.response?.data?.message || 'Error deleting component';
    }
};

const componentService = {
    getComponents,
    getComponentById,
    createComponent,
    placeBid,
    buyItemNow,
    deleteComponent,
};

export default componentService;