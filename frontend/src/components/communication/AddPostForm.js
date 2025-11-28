import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import forumService from '../../services/api/forumService';
import '../../styles/globals.css';

// Pass a function 'onPostCreated' from the parent to refresh the list
const AddPostForm = ({ onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Get user token for authentication
    const { user } = useSelector((state) => state.auth);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!title || !content) {
            setError('Please provide both a title and content.');
            setLoading(false);
            return;
        }

        if (!user || !user.token) {
            setError('You must be logged in to create a post.');
            setLoading(false);
            return;
        }

        try {
            const postData = { title, content };
            await forumService.createPost(postData, user.token);

            // Clear the form
            setTitle('');
            setContent('');
            
            // Call the function passed from the parent to trigger a refresh
            if (onPostCreated) {
                onPostCreated();
            }

        } catch (err) {
            setError(err.toString() || 'Failed to create post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ marginBottom: '2rem' }}>
            <h3>Create a New Post</h3>
            <form onSubmit={onSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows="4"
                        style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #d1d9e0', borderRadius: '8px', boxSizing: 'border-box', fontSize: '1rem', resize: 'vertical' }}
                    ></textarea>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Posting...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
};

export default AddPostForm;