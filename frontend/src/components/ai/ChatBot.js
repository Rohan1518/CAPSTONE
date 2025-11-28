import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import aiService from '../../services/api/aiService';
import '../../styles/globals.css'; // Assuming styles are here

const ChatBot = () => {
    const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi! How can I help you with e-waste today?' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    const { user } = useSelector((state) => state.auth); // Get user token

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        const userMessage = input.trim();
        if (!userMessage) return;

        // Add user message to chat
        setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);
        setError('');

        if (!user || !user.token) {
            setError('Please log in to use the chatbot.');
            setIsLoading(false);
            setMessages((prev) => [...prev, { sender: 'bot', text: 'Error: You need to be logged in.' }]);
            return;
        }

        try {
            // Send message to backend
            const response = await aiService.askChatbot(userMessage, user.token);
            // Add bot reply to chat
            setMessages((prev) => [...prev, { sender: 'bot', text: response.data.reply }]);
        } catch (err) {
            setError(err.toString());
            setMessages((prev) => [...prev, { sender: 'bot', text: `Sorry, I encountered an error: ${err}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Basic styling - consider making this a floating button later
        <div style={{
            position: 'fixed', // Example: Make it fixed
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '450px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000 // Ensure it's above other content
        }}>
            {/* Header */}
            <div style={{ padding: '0.75rem', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>
                E-waste Assistant 🤖
            </div>

            {/* Message Area */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        marginBottom: '0.75rem',
                        textAlign: msg.sender === 'user' ? 'right' : 'left',
                    }}>
                        <span style={{
                           display: 'inline-block',
                           padding: '0.5rem 1rem',
                           borderRadius: '15px',
                           backgroundColor: msg.sender === 'user' ? '#007bff' : '#e9ecef',
                           color: msg.sender === 'user' ? 'white' : '#333',
                           maxWidth: '80%',
                           wordWrap: 'break-word'
                        }}>
                           {msg.text}
                        </span>
                    </div>
                ))}
                 {isLoading && <div style={{textAlign: 'left', fontStyle: 'italic', color: '#666'}}>Bot is typing...</div>}
                <div ref={messagesEndRef} /> {/* For auto-scroll */}
            </div>

             {/* Error Display */}
             {error && <div style={{ color: 'red', padding: '0 1rem 0.5rem 1rem', fontSize: '0.8rem' }}>{error}</div>}

            {/* Input Form */}
            <form onSubmit={handleSend} style={{ display: 'flex', padding: '0.5rem', borderTop: '1px solid #ccc' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about e-waste..."
                    disabled={isLoading}
                    style={{ flexGrow: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '15px 0 0 15px', outline: 'none' }}
                />
                <button type="submit" disabled={isLoading} style={{ padding: '0.5rem 1rem', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '0 15px 15px 0', cursor: 'pointer', width: 'auto', marginTop: 0 }}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBot;