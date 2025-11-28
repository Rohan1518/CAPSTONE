import React, { useState, useMemo } from 'react';
import '../../styles/globals.css';

// Placeholder data for price calculation
const priceData = {
    phone: { new: 50, used: 25, refurbished: 35, 'for-parts': 5 },
    laptop: { new: 200, used: 100, refurbished: 150, 'for-parts': 20 },
    battery: { new: 10, used: 2, refurbished: 5, 'for-parts': 1 },
    screen: { new: 30, used: 10, refurbished: 20, 'for-parts': 3 },
};

const PriceCalculator = () => {
    const [itemType, setItemType] = useState('phone');
    const [condition, setCondition] = useState('used');

    // Calculate the price using useMemo to avoid re-calculating on every render
    const estimatedPrice = useMemo(() => {
        try {
            // Find the base price, default to 0 if not found
            const basePrice = priceData[itemType]?.[condition] || 0;
            return basePrice;
        } catch {
            return 0; // Return 0 if any error occurs
        }
    }, [itemType, condition]); // Re-calculate only when itemType or condition changes

    return (
        <div className="form-container" style={{ maxWidth: '900px', margin: '2rem auto', borderTop: '4px solid #28a745' }}>
            <h2 style={{ textAlign: 'center' }}>E-waste Price Estimator</h2>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'flex-end' }}>
                {/* Item Type Dropdown */}
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label htmlFor="itemType">Item Type</label>
                    <select
                        id="itemType"
                        name="itemType"
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                    >
                        <option value="phone">Phone</option>
                        <option value="laptop">Laptop</option>
                        <option value="battery">Battery</option>
                        <option value="screen">Screen</option>
                        {/* Add more types as needed */}
                    </select>
                </div>

                {/* Condition Dropdown */}
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label htmlFor="conditionSelect">Condition</label>
                    <select
                        id="conditionSelect"
                        name="condition"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                    >
                        <option value="new">New</option>
                        <option value="used">Used</option>
                        <option value="refurbished">Refurbished</option>
                        <option value="for-parts">For Parts</option>
                    </select>
                </div>
            </div>

            {/* Estimated Price Display */}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '0.5rem', color: '#555' }}>Estimated Value:</h3>
                <p style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#28a745', // Green for price
                    margin: 0
                }}>
                    ₹{estimatedPrice.toFixed(2)}
                </p>
                <small style={{ color: '#666' }}>*This is a rough estimate. Prices may vary.</small>
            </div>
        </div>
    );
};

export default PriceCalculator;