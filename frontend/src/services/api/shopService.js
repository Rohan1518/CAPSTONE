import axios from 'axios';

const API_URL = 'http://localhost:5000/api/shops';

// Register a new shop
const registerShop = async (shopData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, shopData, config);

  return response.data;
};

// Get shops registered by the current user
const getMyShops = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/myshops`, config);

  return response.data;
};

const shopService = {
  registerShop,
  getMyShops,
};

export default shopService;
