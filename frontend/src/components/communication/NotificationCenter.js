import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { markAllAsRead, clearNotifications } from '../../store/slices/notificationSlice';
import '../../styles/globals.css'; // We'll add styles here

const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false); // Controls the dropdown visibility
    
    // Get notification data from Redux
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    const dispatch = useDispatch();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        // When opening the dropdown, mark all as read
        if (!isOpen && unreadCount > 0) {
            dispatch(markAllAsRead());
        }
    };

    const handleClearAll = () => {
        dispatch(clearNotifications());
        setIsOpen(false); // Close dropdown after clearing
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* --- Notification Bell Button --- */}
            <button
                onClick={toggleDropdown}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem', // Bell icon size
                    cursor: 'pointer',
                    position: 'relative',
                    width: 'auto', // Override global button styles
                    margin: 0, // Override global button styles
                    padding: '0 10px'
                }}
            >
                🔔
                {/* --- Unread Count Badge --- */}
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '0px',
                        backgroundColor: '#dc3545', // Red
                        color: 'white',
                        borderRadius: '50%',
                        padding: '2px 6px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        lineHeight: '1',
                        minWidth: '10px'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* --- Notification Dropdown Menu --- */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '40px', // Position below the header
                    right: 0,
                    width: '350px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 2000,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    border: '1px solid #eee'
                }}>
                    {/* --- Dropdown Header --- */}
                    <div style={{
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #eee'
                    }}>
                        <span style={{ fontWeight: '600', color: '#333' }}>Notifications</span>
                        <button
                            onClick={handleClearAll}
                            disabled={notifications.length === 0}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#007bff',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                width: 'auto',
                                margin: 0,
                                padding: 0
                            }}
                        >
                            Clear All
                        </button>
                    </div>

                    {/* --- Notification List --- */}
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <p style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No new notifications.</p>
                        ) : (
                            notifications.map((notif, index) => (
                                <Link
                                    key={index}
                                    to={notif.link || '#'} // Use the link from the notification object
                                    onClick={() => setIsOpen(false)} // Close dropdown on click
                                    style={{
                                        display: 'block',
                                        padding: '1rem',
                                        textDecoration: 'none',
                                        color: '#333',
                                        borderBottom: '1px solid #f4f4f4'
                                    }}
                                >
                                    <span style={{ display: 'block', fontSize: '0.9rem' }}>{notif.message}</span>
                                    {/* Optionally add a timestamp here */}
                                
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;