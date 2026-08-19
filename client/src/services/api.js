/**
 * API fetch client wrapper for backend communication
 */

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('hourlee_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'An API error occurred');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const authAPI = {
  signup: async (username, email, password) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return handleResponse(res);
  },

  login: async (login, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  addSuggestion: async (text) => {
    const res = await fetch(`${API_BASE}/auth/suggestions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
    return handleResponse(res);
  },

  removeSuggestion: async (text) => {
    const res = await fetch(`${API_BASE}/auth/suggestions`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
    return handleResponse(res);
  }
};

export const activityAPI = {
  getActivities: async (dateStr) => {
    const query = dateStr ? `?date=${dateStr}` : '';
    const res = await fetch(`${API_BASE}/activities${query}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  setProductivityWindow: async (date, workStart, workEnd, skip = false) => {
    const res = await fetch(`${API_BASE}/activities/productivity-window`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ date, workStart, workEnd, skip })
    });
    return handleResponse(res);
  },

  getHistory: async () => {
    const res = await fetch(`${API_BASE}/activities/history`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  createActivity: async (activityData) => {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(activityData)
    });
    return handleResponse(res);
  },

  stopActivity: async (id, endTime = null) => {
    const res = await fetch(`${API_BASE}/activities/${id}/stop`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ endTime })
    });
    return handleResponse(res);
  },

  updateActivity: async (id, updateData) => {
    const res = await fetch(`${API_BASE}/activities/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(res);
  },

  deleteActivity: async (id) => {
    const res = await fetch(`${API_BASE}/activities/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};

export const analyticsAPI = {
  getAnalytics: async (range = 'today') => {
    const res = await fetch(`${API_BASE}/analytics?range=${range}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
