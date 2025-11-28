import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Import ethers v5

const ConnectWallet = () => {
    const [account, setAccount] = useState(null); // Store the connected account address
    const [error, setError] = useState('');

    // Check if wallet is already connected when component loads
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    // Function to check connection status
    const checkIfWalletIsConnected = async () => {
        setError('');
        try {
            // MetaMask injects 'ethereum' object into window
            const { ethereum } = window;
            if (!ethereum) {
                console.log("Make sure you have MetaMask!");
                return;
            } else {
                console.log("We have the ethereum object", ethereum);
            }

            // Check if we're authorized to access the user's wallet
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                const accountAddress = accounts[0];
                console.log("Found an authorized account:", accountAddress);
                setAccount(accountAddress);
            } else {
                console.log("No authorized account found");
            }
        } catch (err) {
            console.error("Error checking wallet connection:", err);
            setError('Error checking wallet connection.');
        }
    };

    // Function to handle the connect button click
    const connectWallet = async () => {
        setError('');
        try {
            const { ethereum } = window;
            if (!ethereum) {
                setError("MetaMask not detected. Please install it.");
                alert("MetaMask not detected. Please install it.");
                return;
            }

            // Request account access
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            console.log("Connected", accounts[0]);
            setAccount(accounts[0]);
        } catch (err) {
            console.error("Error connecting wallet:", err);
            setError('Failed to connect wallet. User might have rejected the request.');
        }
    };

    return (
        <div style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff', textAlign: 'center', marginTop: '1rem' }}>
            {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
            {account ? (
                <div>
                    <p style={{ fontWeight: '600', color: '#28a745' }}>Wallet Connected!</p>
                    <p style={{ fontSize: '0.8rem', wordWrap: 'break-word' }}>
                        Address: {account}
                    </p>
                </div>
            ) : (
                <button
                    onClick={connectWallet}
                    style={{
                        backgroundColor: '#ffc107',
                        color: '#333',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        width: 'auto', // Override global button width
                        marginTop: 0 // Override global button margin
                    }}
                >
                    Connect Wallet (e.g., MetaMask)
                </button>
            )}
        </div>
    );
};

export default ConnectWallet;