import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // 👈 1. Import useDispatch
import io from 'socket.io-client';
import { addNotification } from '../../store/slices/notificationSlice'; // 👈 2. Import the Redux action
import '../../styles/globals.css';

// Connect to the backend Socket.IO server
const socket = io('http://localhost:5000');

const ChatSystem = () => {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const chatEndRef = useRef(null);

    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch(); // 👈 3. Initialize dispatch

    // Effect to handle incoming messages, notifications, and auth
    useEffect(() => {
        // --- Authenticate socket connection ---
        if (user?.token) {
            socket.emit('authenticate', user.token);
            console.log('Socket: Emitted authenticate event.');
        }

        // --- Listener for chat messages ---
        const handleNewMessage = (msg) => {
            setChatLog((prevLog) => [...prevLog, msg]);
        };
        socket.on('chat message', handleNewMessage);
        
        // --- NEW: Listener for notifications ---
        const handleNewNotification = (notification) => {
            console.log('New Notification Received:', notification);
            // 👈 4. Dispatch the action instead of alerting
            dispatch(addNotification(notification)); 
        };
        socket.on('new_notification', handleNewNotification);
        // --- End New Listener ---

        // Cleanup function: Remove listeners
        return () => {
            socket.off('chat message', handleNewMessage);
            socket.off('new_notification', handleNewNotification);
        };
    }, [user?.token, dispatch]); // 👈 5. Add dispatch to dependency array

    // Effect to scroll to the bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatLog]);

    // Function to send a message
    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('chat message', message);
            setMessage('');
        }
    };

    // --- (Rest of the component's return/JSX remains the same) ---
    return (
        <div className="chat-container" style={{
            position: 'fixed',
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
            zIndex: 1000
        }}>
            {/* Header */}
            <div style={{ padding: '0.75rem', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>
                E-waste Assistant 🤖
            </div>

            {/* Message Display Area */}
            <div className="chat-log" style={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {chatLog.map((msg, index) => (
                    <div key={index} style={{
                        marginBottom: '0.75rem',
                        alignSelf: msg.id === socket.id ? 'flex-end' : 'flex-start'
                    }}>
                         <span style={{
                            fontSize: '0.75rem',
                            color: '#666',
                            display: 'block',
                            textAlign: msg.id === socket.id ? 'right' : 'left'
                         }}>
                           {msg.id === socket.id ? 'You' : `User ${msg.id.substring(0, 4)}`}
                         </span>
                         <span style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            borderRadius: '15px',
                            backgroundColor: msg.id === socket.id ? '#007bff' : '#e9ecef',
                            color: msg.id === socket.id ? 'white' : '#333',
                            maxWidth: '100%',
                            wordWrap: 'break-word'
                        }}>
                             {msg.message}
                         </span>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Message Input Form */}
            <form onSubmit={sendMessage} style={{
                display: 'flex',
                padding: '0.5rem',
                borderTop: '1px solid #ccc',
                backgroundColor: '#f8f9fa'
            }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                        flexGrow: 1,
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '20px 0 0 20px',
                        outline: 'none'
                    }}
                />
                <button type="submit" style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderRadius: '0 20px 20px 0',
                    cursor: 'pointer',
                    width: 'auto',
                    marginTop: 0
                }}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatSystem;