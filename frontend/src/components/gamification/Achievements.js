import React, { useState, useEffect } from 'react';
import achievementService from '../../services/api/achievementService';
import '../../styles/globals.css'; // Assuming styles are here

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                setLoading(true);
                const data = await achievementService.getAllAchievements();
                setAchievements(data.data.achievements || []);
                setError('');
            } catch (err) {
                setError('Failed to load achievements list.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []); // Runs once on component mount

    return (
        <div className="achievements-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1a252f' }}>🏅 Available Achievements 🏅</h2>

            {loading && <p style={{ textAlign: 'center' }}>Loading achievements...</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {!loading && !error && (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {achievements.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>No achievements defined yet.</p>
                    ) : (
                        achievements.map(ach => (
                            <li key={ach._id} style={{
                                backgroundColor: '#fff',
                                padding: '1rem 1.5rem',
                                marginBottom: '0.75rem',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                display: 'flex',
                                alignItems: 'center', // Align icon and text
                                gap: '1rem' // Space between icon and text
                            }}>
                                {/* Placeholder for an icon based on ach.icon */}
                                <span style={{ fontSize: '1.5rem' }}>🏅</span> 
                                <div>
                                    <strong style={{ display: 'block', color: '#1a252f' }}>{ach.name}</strong>
                                    <small style={{ color: '#555' }}>{ach.description}</small>
                                    {ach.pointsAwarded > 0 && 
                                      <span style={{ fontSize: '0.8rem', color: '#28a745', fontWeight: '600', marginLeft: '0.5rem' }}>
                                        (+{ach.pointsAwarded} pts)
                                      </span>
                                    }
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default Achievements;