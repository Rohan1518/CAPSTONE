const { ethers } = require('ethers'); // Import ethers
const { getProvider } = require('../../config/blockchain');
// const { getSigner } // Import signer if needed later for 'verifyItem'

// --- Contract Details ---
// 1. Paste the contract address you got after deployment
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; 

// 2. Paste the ABI array you copied from RecyclingVerification.json
const contractABI = 
  // Example ABI structure - REPLACE THIS WITH YOUR ACTUAL COPIED ABI
   [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "recycler",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "componentId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ItemVerified",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_componentId",
          "type": "string"
        }
      ],
      "name": "getVerification",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "recycler",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "componentId",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct RecyclingVerification.VerificationRecord",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "verifiedItems",
      "outputs": [
        {
          "internalType": "address",
          "name": "recycler",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "componentId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_componentId",
          "type": "string"
        }
      ],
      "name": "verifyItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
// --- End Contract Details ---

const provider = getProvider();
let contractInstance = null;

// Function to get the contract instance
const getContract = () => {
    if (!contractInstance && provider && contractAddress && contractABI) {
        // Create contract instance (read-only for now)
        contractInstance = new ethers.Contract(contractAddress, contractABI, provider);
        console.log("📄 Contract instance created for RecyclingVerification");
    } else if (!provider) {
         console.warn('Cannot create contract instance: Provider not connected.');
    }
    // To write to the contract, you'd need a signer:
    // const signer = getSigner();
    // if (signer) { contractInstance = new ethers.Contract(contractAddress, contractABI, signer); }
    return contractInstance;
};

/**
 * @desc    Call the verifyItem function on the smart contract
 * @param   {string} componentId - The ID of the item to verify
 * @param   {ethers.Signer} signer - The wallet authorized to call verifyItem
 */
const verifyItemOnChain = async (componentId, signer) => {
    // Requires a signer (wallet) to send a transaction
    if (!signer) {
        throw new Error('Signer required to verify item.');
    }
     const contract = new ethers.Contract(contractAddress, contractABI, signer); // Use signer here
    try {
        console.log(`⛓️ Calling verifyItem for component: ${componentId}`);
        // Send the transaction
        const tx = await contract.verifyItem(componentId);
        console.log(` Transaction sent: ${tx.hash}`);
        // Wait for the transaction to be mined (optional, but good practice)
        const receipt = await tx.wait();
        console.log(` Transaction mined in block: ${receipt.blockNumber}`);
        return receipt; // Return the transaction receipt
    } catch (error) {
        console.error(`❌ Error calling verifyItem for ${componentId}:`, error);
        throw error;
    }
};

/**
 * @desc    Call the getVerification function on the smart contract
 * @param   {string} componentId - The ID of the item to check
 */
const getVerificationFromChain = async (componentId) => {
    const contract = getContract(); // Get read-only instance
    if (!contract) {
        throw new Error('Contract not initialized or provider not connected.');
    }
    try {
        console.log(`⛓️ Calling getVerification for component: ${componentId}`);
        const result = await contract.getVerification(componentId);
        console.log(' Verification result:', result);
        // Process the result if needed (e.g., check timestamp > 0)
        if (result.timestamp > 0) {
             return {
                 recycler: result.recycler,
                 componentId: result.componentId,
                 timestamp: Number(result.timestamp) // Convert BigInt to Number
             };
        } else {
            return null; // Item not verified
        }
    } catch (error) {
        console.error(`❌ Error calling getVerification for ${componentId}:`, error);
        throw error;
    }
};


module.exports = {
    verifyItemOnChain,
    getVerificationFromChain,
    // getLatestBlockNumber, // Keep this if you still need it
};