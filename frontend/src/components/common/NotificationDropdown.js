import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getSocket } from '../../services/socket';

const NotificationDropdown = () => {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
      
      const socket = getSocket();
      if (socket) {
        socket.on('notification', (newNotif) => {
          setNotifications(prev => [newNotif, ...prev]);
          setUnreadCount(prev => prev + 1);
          // Optional: Play sound
        });
      }
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      const socket = getSocket();
      if (socket) {
        socket.off('notification');
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(data.data.notifications);
      setUnreadCount(data.data.notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
      // Recalculate unread count if needed, but usually we delete read ones
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          position: 'relative',
          padding: '0.5rem'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            padding: '0.1rem 0.4rem',
            fontSize: '0.7rem',
            fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          width: '300px',
          maxHeight: '400px',
          overflowY: 'auto',
          backgroundColor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          zIndex: 1000,
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
            Notifications
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
              No notifications
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif._id}
                onClick={() => !notif.read && markAsRead(notif._id)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #eee',
                  backgroundColor: notif.read ? 'white' : '#f0f7ff',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>{notif.title}</strong>
                  <button 
                    onClick={(e) => deleteNotification(e, notif._id)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#999' }}
                  >
                    ✕
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>{notif.message}</p>
                <small style={{ color: '#999', fontSize: '0.75rem' }}>
                  {new Date(notif.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
