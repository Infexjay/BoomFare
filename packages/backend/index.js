const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Mock Data
const users = [
  { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob' },
  { id: '3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie' },
];

let messages = [
  { id: '1', sender_id: '1', recipient_id: '2', content: 'Hey Bob!', message_type: 'text', created_date: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: '2', sender_id: '2', recipient_id: '1', content: 'Hey Alice! How are you?', message_type: 'text', created_date: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
  { id: '3', sender_id: '1', recipient_id: '2', content: 'I am good, thanks! How about you?', message_type: 'text', created_date: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  { id: '4', sender_id: '1', recipient_id: '3', content: 'Hi Charlie!', message_type: 'text', created_date: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
];

// API Endpoints
app.get('/api/users/me', (req, res) => {
  res.json(users[0]); // Alice is the current user
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/messages', (req, res) => {
  const { filter } = req.query;
  if (filter) {
    try {
      const filterObj = JSON.parse(filter);
      if (filterObj.$or) {
        const [condition1, condition2] = filterObj.$or;
        const filteredMessages = messages.filter(msg =>
          (msg.sender_id === condition1.sender_id && msg.recipient_id === condition1.recipient_id) ||
          (msg.sender_id === condition2.sender_id && msg.recipient_id === condition2.recipient_id)
        );
        return res.json(filteredMessages);
      }
    } catch (e) {
      return res.status(400).json({ error: "Invalid filter format" });
    }
  }
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const newMessage = {
    id: uuidv4(),
    ...req.body,
    created_date: new Date().toISOString(),
  };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});


app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
