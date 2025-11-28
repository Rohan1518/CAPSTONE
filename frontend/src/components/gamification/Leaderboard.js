import React, { useState, useEffect } from 'react';
import userService from '../../services/api/userService';
import '../../styles/globals.css'; // Assuming styles are here

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const data = await userService.getLeaderboard();
                setLeaderboard(data.data.leaderboard || []);
                setError('');
            } catch (err) {
                setError('Failed to load leaderboard.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []); // Runs once on component mount

    return (
        <div className="leaderboard-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1a252f' }}>🏆 Leaderboard 🏆</h2>

            {loading && <p style={{ textAlign: 'center' }}>Loading leaderboard...</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {!loading && !error && (
                <ol style={{ listStyle: 'none', padding: 0 }}>
                    {leaderboard.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>No users with points yet!</p>
                    ) : (
                        leaderboard.map((user, index) => (
                            <li key={user._id} style={{
                                backgroundColor: '#fff',
                                padding: '1rem 1.5rem',
                                marginBottom: '0.75rem',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderLeft: `5px solid ${index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#007bff'}` // Gold, Silver, Bronze, Blue
                            }}>
                                <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                                    {index + 1}. {user.name}
                                </span>
                                <span style={{ fontWeight: 'bold', color: '#007bff', fontSize: '1.1rem' }}>
                                    {user.points} pts
                                </span>
                            </li>
                        ))
                    )}
                </ol>
            )}
        </div>
    );
};

export default Leaderboard;