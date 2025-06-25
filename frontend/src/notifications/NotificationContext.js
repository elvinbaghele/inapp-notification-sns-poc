import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Create the context
const NotificationContext = createContext();

export const NotificationProvider = ({ userId, children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userId) return;
        // Connect to your backend WebSocket gateway
        const socket = io('http://localhost:3001/notifications', {
            query: { userId },
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('WebSocket connected:', socket.id);
        });
        socket.on('connect_error', (err) => {
            console.error('WebSocket connection error:', err);
        });
        // Listen for new notifications
        socket.on('new-notification', (notification) => {
            console.log('Received notification:', notification);
            setNotifications((prev) => [notification, ...prev]);
        });
        // Optionally, listen for unread count updates
        socket.on('unread-count', ({ count }) => {
            console.log('Received unread count:', count);
        });
        // Clean up on unmount
        return () => {
            socket.disconnect();
        };
    }, [userId]);

    const value = { userId, notifications, setNotifications };
    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext); 