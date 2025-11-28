import React, { useState, useEffect } from 'react';
import challengeService from '../../services/api/challengeService'; // Import the service
import userService from '../../services/api/userService'; // Import userService
import { useSelector } from 'react-redux'; // Import useSelector
import '../../styles/globals.css';

const Challenges = () => {
  // State for all active challenges definitions
  const [allChallenges, setAllChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [errorChallenges, setErrorChallenges] = useState('');

  // State for the logged-in user's progress
  const [userProgress, setUserProgress] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [errorProgress, setErrorProgress] = useState('');

  // Get user token from Redux to fetch progress
  const { user } = useSelector((state) => state.auth);

  // Fetch all active challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoadingChallenges(true);
        const data = await challengeService.getAllChallenges();
        setAllChallenges(data.data.challenges || []); // Ensure it's an array
        setErrorChallenges('');
      } catch (err) {
        setErrorChallenges('Failed to load challenges.');
        console.error(err);
      } finally {
        setLoadingChallenges(false);
      }
    };
    fetchChallenges();
  }, []);

  // Fetch user's challenge progress if logged in
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (user?.token) { // Only fetch if user is logged in
        try {
          setLoadingProgress(true);
          const data = await userService.getMyChallengeProgress(user.token);
          setUserProgress(data.data.challengeProgress || []); // Array of { challenge: {_id, title,...}, currentValue, completed }
          setErrorProgress('');
        } catch (err) {
          setErrorProgress('Failed to load your challenge progress.');
          console.error(err);
        } finally {
          setLoadingProgress(false);
        }
      } else {
        // Not logged in, set progress loading to false and clear progress
        setUserProgress([]);
        setLoadingProgress(false);
      }
    };
    fetchUserProgress();
  }, [user?.token]); // Re-run if the user logs in/out

  // Helper function to get progress display for a specific challenge
  const getProgressDisplay = (challenge) => {
    if (!user) return "Log in to track"; // User not logged in

    // Find the progress data for this specific challenge ID
    // Note: userProgress has populated challenge details
    const progressData = userProgress.find(p => p.challenge?._id === challenge._id);

    if (progressData?.completed) {
      return <span style={{ color: 'green', fontWeight: 'bold' }}>Completed! 🎉</span>;
    }
    if (progressData) {
      // Display current value vs goal value
      return `${progressData.currentValue} / ${challenge.goal.value}`;
    }
    // If no progress data found for this challenge for this user
    return `0 / ${challenge.goal.value}`;
  };

  // Combine loading states
  const isLoading = loadingChallenges || loadingProgress;
  const error = errorChallenges || errorProgress;

  return (
    <div className="challenges-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1a252f' }}>🎯 Current Challenges 🎯</h2>

      {isLoading && <p style={{ textAlign: 'center' }}>Loading challenges...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {!isLoading && !error && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allChallenges.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No active challenges right now.</p>
          ) : (
            allChallenges.map(challenge => (
              <li key={challenge._id} style={{
                backgroundColor: '#fff',
                padding: '1.5rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                borderLeft: '4px solid #fd7e14' // Orange accent
              }}>
                <h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#1a252f' }}>{challenge.title}</h4>
                <p style={{ color: '#555', margin: '0.25rem 0' }}>{challenge.description}</p>
                {/* Display Goal */}
                <p style={{ color: '#555', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                  Goal: {challenge.goal.value} ({challenge.goal.type.replace('_', ' ')})
                </p>
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: '600', color: '#28a745' }}>Reward: {challenge.rewardPoints} points</span>
                  <span style={{ fontStyle: 'italic', color: '#666' }}>
                    Progress: {getProgressDisplay(challenge)} {/* Use helper function */}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Challenges;