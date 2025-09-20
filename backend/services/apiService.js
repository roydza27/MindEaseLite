// API Service for frontend to communicate with Express backend
class ApiService {
  constructor(baseURL = 'http://localhost:3001/api') {
    this.baseURL = baseURL;
    this.token = null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
  }

  // Get headers with auth token
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // User API methods
  async registerUser(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginUser(credentials) {
    const response = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateUserSettings(settings) {
    return this.request('/users/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Mood API methods
  async addMoodEntry(moodData) {
    return this.request('/moods', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  }

  async getMoodEntries(limit = 30, page = 1) {
    return this.request(`/moods?limit=${limit}&page=${page}`);
  }

  async getMoodStats(days = 30) {
    return this.request(`/moods/stats?days=${days}`);
  }

  async updateMoodEntry(id, moodData) {
    return this.request(`/moods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(moodData),
    });
  }

  async deleteMoodEntry(id) {
    return this.request(`/moods/${id}`, {
      method: 'DELETE',
    });
  }

  // Timer API methods
  async addTimerSession(sessionData) {
    return this.request('/timers', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async getTimerSessions(limit = 50, page = 1, completed = null) {
    let endpoint = `/timers?limit=${limit}&page=${page}`;
    if (completed !== null) {
      endpoint += `&completed=${completed}`;
    }
    return this.request(endpoint);
  }

  async getTimerStats(days = 30) {
    return this.request(`/timers/stats?days=${days}`);
  }

  async updateTimerSession(id, sessionData) {
    return this.request(`/timers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  async completeTimerSession(id) {
    return this.request(`/timers/${id}/complete`, {
      method: 'PUT',
    });
  }

  async deleteTimerSession(id) {
    return this.request(`/timers/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health', {
      baseURL: 'http://localhost:3001',
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
