// API Service for connecting to the MindEase backend
const API_BASE_URL = 'http://localhost:3001';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  settings: {
    theme: 'light' | 'dark';
    language: 'en' | 'es' | 'fr';
    notifications: boolean;
  };
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: number; // 1-5 scale
  stress: number; // 1-5 scale
  anxiety: number; // 1-5 scale
  notes?: string;
  createdAt: string;
}

export interface TimerSession {
  id: string;
  userId: string;
  duration: number; // in minutes
  completed: boolean;
  startTime: string;
  endTime?: string;
  notes?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request('/health');
  }

  // User operations
  async createUser(userData: Partial<User>): Promise<User> {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(userId: string): Promise<User> {
    return this.request(`/api/users/${userId}`);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Mood tracking operations
  async addMoodEntry(moodData: Omit<MoodEntry, 'id' | 'userId' | 'createdAt'>): Promise<MoodEntry> {
    return this.request('/api/mood-entries', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  }

  async getMoodEntries(userId: string, limitCount: number = 30): Promise<MoodEntry[]> {
    return this.request(`/api/mood-entries?userId=${userId}&limit=${limitCount}`);
  }

  // Timer session operations
  async addTimerSession(sessionData: Omit<TimerSession, 'id' | 'userId' | 'startTime'>): Promise<TimerSession> {
    return this.request('/api/timer-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateTimerSession(sessionId: string, updates: Partial<TimerSession>): Promise<TimerSession> {
    return this.request(`/api/timer-sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getTimerSessions(userId: string, limitCount: number = 50): Promise<TimerSession[]> {
    return this.request(`/api/timer-sessions?userId=${userId}&limit=${limitCount}`);
  }
}

export const apiService = new ApiService();




