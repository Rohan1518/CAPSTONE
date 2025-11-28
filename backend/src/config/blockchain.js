const { ethers } = require('ethers');
require('dotenv').config(); // Ensure environment variables are loaded

// Get the RPC URL from environment variables for security and flexibility
// You might use Infura, Alchemy, or a local node URL
const providerUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545'; // Default to local node

// Create a provider instance to connect to the blockchain network
let provider;
try {
    provider = new ethers.providers.JsonRpcProvider(providerUrl); // CORRECT for v5
    console.log(`🔗 Blockchain provider connected to: ${providerUrl}`);
} catch (error) {
    console.error(`❌ Failed to connect blockchain provider at ${providerUrl}:`, error);
    // Depending on your app's needs, you might exit or just log the error
    provider = null; 
}

// Function to get the provider instance
const getProvider = () => {
    if (!provider) {
        console.warn('Blockchain provider is not connected.');
    }
    return provider;
};

// Example: Load a wallet/signer if needed (e.g., for sending transactions)
// const privateKey = process.env.SIGNER_PRIVATE_KEY;
// let signer = null;
// if (privateKey && provider) {
//     try {
//         signer = new ethers.Wallet(privateKey, provider);
//         console.log(`🔑 Signer loaded for address: ${signer.address}`);
//     } catch (error) {
//         console.error('❌ Failed to load signer:', error);
//     }
// }

// const getSigner = () => signer;

module.exports = {
    getProvider,
    // getSigner, // Export signer if you need it globally
};