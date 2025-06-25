import React, { useState } from 'react';
import axios from 'axios';
// You will need to implement NotificationProvider and NotificationFeed in frontend/src/notifications/
import { NotificationProvider } from './notifications/NotificationContext';
import NotificationFeed from './notifications/NotificationFeed';

function App() {
  // Replace with actual user ID (from auth or test)
  const userId = 'YOUR_USER_ID';
  const [commentText, setCommentText] = useState('');
  const [taskId, setTaskId] = useState('some-task-id');
  const [mentionUserIds, setMentionUserIds] = useState(''); // comma-separated
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        text: commentText,
        taskId,
        mention_user_ids: mentionUserIds
          .split(',')
          .map(id => id.trim())
          .filter(Boolean),
      };
      const res = await axios.post('http://localhost:3001/comments', payload);
      setResponse(res.data);
      setCommentText('');
      setMentionUserIds('');
    } catch (err) {
      setResponse({ error: err.message });
    }
  };

  return (
    <NotificationProvider userId={userId}>
      <div style={{ maxWidth: 500, margin: '2rem auto' }}>
        <h1>Notification Demo</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <div>
            <label>Task ID: </label>
            <input value={taskId} onChange={e => setTaskId(e.target.value)} required />
          </div>
          <div>
            <label>Comment: </label>
            <input value={commentText} onChange={e => setCommentText(e.target.value)} required style={{ width: 300 }} />
          </div>
          <div>
            <label>Mention User IDs (comma separated): </label>
            <input
              value={mentionUserIds}
              onChange={e => setMentionUserIds(e.target.value)}
              placeholder="user3, user4"
              style={{ width: 300 }}
            />
          </div>
          <button type="submit">Submit Comment</button>
        </form>
        {response && (
          <pre style={{ background: '#f6f8fa', padding: 8 }}>{JSON.stringify(response, null, 2)}</pre>
        )}
        <NotificationFeed />
      </div>
    </NotificationProvider>
  );
}

export default App;
