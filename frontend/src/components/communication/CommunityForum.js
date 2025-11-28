import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/globals.css'; // Assuming styles are here

// 1. Accept posts, loading, and error as props from the parent (Community.js)
const CommunityForum = ({ posts, loading, error }) => {

    // Removed the useState and useEffect hooks for fetching

    return (
        <div className="forum-container">
            {/* Removed the H2 title, it's now in the parent page */}

            {loading && <p style={{ textAlign: 'center' }}>Loading posts...</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {!loading && !error && (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {posts.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>No posts yet. Be the first to start a discussion!</p>
                    ) : (
                        posts.map(post => (
                            <li key={post._id} style={{
                                backgroundColor: '#fff',
                                padding: '1.5rem',
                                marginBottom: '1rem',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                borderLeft: '4px solid #007bff' // Accent color
                            }}>
                                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                                    {/* Link to view the single post (route not created yet) */}
                                    <Link to={`/forum/${post._id}`} style={{ textDecoration: 'none', color: '#0056b3' }}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <small style={{ color: '#666' }}>
                                    Posted by {post.author ? post.author.name : 'Unknown User'} on {new Date(post.createdAt).toLocaleDateString()}
                                </small>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default CommunityForum;