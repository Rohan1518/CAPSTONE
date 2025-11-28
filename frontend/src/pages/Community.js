import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CommunityForum from '../components/communication/CommunityForum';
import AddPostForm from '../components/communication/AddPostForm';
import ChatSystem from '../components/communication/ChatSystem'; // 👈 1. Import ChatSystem
import forumService from '../services/api/forumService';
import '../styles/globals.css';

const Community = () => {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
      try {
          setLoading(true);
          const data = await forumService.getAllPosts();
          setPosts(data.data.posts || []);
          setError('');
      } catch (err) {
          setError('Failed to load forum posts.');
          console.error(err);
      } finally {
          setLoading(false);
      }
  }, []);

  useEffect(() => {
      fetchPosts();
  }, [fetchPosts]);

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{
        backgroundColor: '#ffffff',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ color: '#1a252f', margin: 0, fontSize: '1.5rem' }}>
          Community Hub
        </h1>
        <Link to="/dashboard" style={{
            textDecoration: 'none',
            color: '#007bff',
            fontWeight: '600'
        }}>
          Back to Dashboard
        </Link>
      </header>

      <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* --- Forum Section --- */}
        {user && <AddPostForm onPostCreated={fetchPosts} />}
        {user && <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #ccc' }} />}
        <CommunityForum posts={posts} loading={loading} error={error} />

        {/* --- Separator --- */}
        <hr style={{ margin: '3rem 0', border: 'none', borderTop: '2px solid #ddd' }} />

        {/* --- Chat Section --- */}
        {/* 👇 2. Add the ChatSystem component here */}
        <ChatSystem />

      </main>
    </div>
  );
};

export default Community;