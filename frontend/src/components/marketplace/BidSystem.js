import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import componentService from '../../services/api/componentService';
import '../../styles/globals.css';

// This component receives the component object as a prop
// and a function to refresh the data on success
const BidSystem = ({ component, onBidSuccess }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { user } = useSelector((state) => state.auth);

    const handleSubmitBid = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const amount = parseFloat(bidAmount);
        if (!amount || amount <= component.currentPrice) {
            setError(`Your bid must be higher than $${component.currentPrice}`);
            setLoading(false);
            return;
        }

        if (!user || !user.token) {
            setError('You must be logged in to place a bid.');
            setLoading(false);
            return;
        }
        
        // ✅ FIX: Use user._id instead of user.data.user._id
        if (user._id === component.seller._id) {
             setError('You cannot bid on your own item.');
             setLoading(false);
             return;
        }

        try {
            // Call the API service
            const response = await componentService.placeBid(component._id, amount, user.token);
            // Call the parent function to update the component data
            onBidSuccess(response.data.component);
            setBidAmount(''); // Clear input
        } catch (err) {
            setError(err.toString() || 'Failed to place bid.');
        } finally {
            setLoading(false);
        }
    };

    // Check if the auction is over
    const auctionEnded = component.auctionEndTime && new Date() > new Date(component.auctionEndTime);
    
    if (auctionEnded) {
        return (
             <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ color: '#dc3545', margin: 0 }}>Auction Ended</h4>
                <p style={{ margin: '0.5rem 0', color: '#333' }}>
                    Won by {component.highestBidder ? component.highestBidder.name : 'N/A'} at ${component.currentPrice}
                </p>
             </div>
        );
    }

    return (
        <div className="bid-system-container">
            <form onSubmit={handleSubmitBid}>
                <div className="form-group">
                    <label htmlFor="bidAmount" style={{ fontWeight: '600' }}>Your Bid</label>
                    <input
                        type="number"
                        id="bidAmount"
                        name="bidAmount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Must be > $${component.currentPrice}`}
                        step="0.01"
                        min={component.currentPrice + 0.01}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                    {loading ? 'Placing Bid...' : 'Place Bid'}
                </button>
            </form>
            
            {/* Bid History (optional) */}
            <div style={{ marginTop: '1.5rem' }}>
                <h5 style={{ marginBottom: '0.5rem', color: '#555' }}>Bid History ({component.bids.length})</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '100px', overflowY: 'auto' }}>
                    {component.bids.slice(0).reverse().map((bid, index) => ( // Show newest first
                        <li key={index} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            fontSize: '0.9rem', 
                            padding: '0.25rem 0',
                            borderBottom: '1px solid #eee'
                        }}>
                            <span>{bid.bidder ? bid.bidder.name : 'A user'}</span>
                            <span style={{ fontWeight: '600' }}>${bid.amount}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BidSystem;