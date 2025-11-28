import axios from 'axios';

// The base URL of your backend API
const API_URL = 'http://localhost:5000/api/locations/';

/**
 * @desc    Get locations from the backend, filtering by search and/or bbox
 * @access  Public
 */
const getLocations = async (searchTerm = '', bbox = null, category = '') => {
    try {
        const params = new URLSearchParams();
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        if (bbox) {
            params.append('bbox', bbox); // bbox is expected to be a string
        }
        if (category) {
            params.append('category', category);
        }
        
        const queryString = params.toString();
        const url = queryString ? `${API_URL}?${queryString}` : API_URL;

        console.log("📡 Fetching locations from:", url);

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error.response?.data?.message || 'Error fetching locations';
    }
};

/**
 * @desc    Create a new location
 * @access  Private (requires token)
 */
const createLocation = async (locationData, token) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await axios.post(API_URL, locationData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating location:', error);
        throw error.response?.data?.message || 'Error creating location';
    }
};


const locationService = {
    getLocations,
    createLocation,
};

export default locationService;