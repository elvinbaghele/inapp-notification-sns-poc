import React, { useEffect, useState } from 'react';
import { useNotification } from './NotificationContext';

const bellStyle = {
    fontSize: 28,
    position: 'relative',
    marginRight: 8,
};
const dotStyle = {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    background: 'red',
    borderRadius: '50%',
    border: '2px solid #fff',
};

const NotificationFeed = () => {
    const { userId, notifications = [] } = useNotification();
    const [feed, setFeed] = useState(notifications);

    useEffect(() => {
        setFeed(notifications);
    }, [notifications]);

    return (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16, marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ position: 'relative', display: 'inline-block' }}>
                    <span role="img" aria-label="bell" style={bellStyle}>🔔</span>
                    {feed.length > 0 && <span style={dotStyle}></span>}
                </span>
                <h3 style={{ margin: 0 }}>Notifications</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {feed.length === 0 ? (
                    <li style={{ padding: '6px 0', color: '#888' }}>No notifications yet.</li>
                ) : (
                    feed.map(n => (
                        <li key={n.id} style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                            {n.message}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default NotificationFeed; 