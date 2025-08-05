const API_BASE_URL = 'http://localhost:3001/api';

export const User = {
  me: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`);
    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }
    return response.json();
  },
  list: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },
};

export const Message = {
  filter: async (filter, sortBy) => {
    const query = new URLSearchParams();
    if (filter) {
      query.append('filter', JSON.stringify(filter));
    }
    if (sortBy) {
      query.append('sortBy', sortBy);
    }
    const response = await fetch(`${API_BASE_URL}/messages?${query.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    const messages = await response.json();
    // The frontend expects date objects, but JSON transport converts them to strings.
    // Let's convert them back to Date objects.
    return messages.map(msg => ({
      ...msg,
      created_date: new Date(msg.created_date),
    }));
  },
  create: async (messageData) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });
    if (!response.ok) {
      throw new Error('Failed to create message');
    }
    return response.json();
  },
};
