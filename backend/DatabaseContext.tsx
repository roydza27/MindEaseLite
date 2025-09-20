import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import apiService from './services/apiService';

// Types for our data
export interface User {
  _id: string;
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
  _id: string;
  userId: string;
  mood: number; // 1-5 scale
  stress: number; // 1-5 scale
  anxiety: number; // 1-5 scale
  notes?: string;
  createdAt: string;
}

export interface TimerSession {
  _id: string;
  userId: string;
  duration: number; // in minutes
  completed: boolean;
  startTime: string;
  endTime?: string;
  notes?: string;
}

export interface DatabaseContextType {
  // User operations
  currentUser: User | null;
  loginUser: (email: string, password: string) => Promise<User>;
  registerUser: (userData: { name: string; email: string; password: string }) => Promise<User>;
  updateUserSettings: (settings: Partial<User['settings']>) => Promise<void>;
  logoutUser: () => void;
  
  // Mood tracking operations
  addMoodEntry: (moodData: Omit<MoodEntry, '_id' | 'userId' | 'createdAt'>) => Promise<string>;
  getMoodEntries: (limitCount?: number, page?: number) => Promise<MoodEntry[]>;
  getMoodStats: (days?: number) => Promise<any>;
  updateMoodEntry: (moodId: string, updates: Partial<MoodEntry>) => Promise<void>;
  deleteMoodEntry: (moodId: string) => Promise<void>;
  
  // Timer session operations
  addTimerSession: (sessionData: Omit<TimerSession, '_id' | 'userId' | 'startTime'>) => Promise<string>;
  updateTimerSession: (sessionId: string, updates: Partial<TimerSession>) => Promise<void>;
  completeTimerSession: (sessionId: string) => Promise<void>;
  getTimerSessions: (limitCount?: number, page?: number, completed?: boolean) => Promise<TimerSession[]>;
  getTimerStats: (days?: number) => Promise<any>;
  deleteTimerSession: (sessionId: string) => Promise<void>;
  
  // Loading states
  loading: boolean;
  error: string | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize user session on app start
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check if there's a stored token
        const token = localStorage.getItem('authToken');
        if (token) {
          apiService.setToken(token);
          // Try to get current user info
          const response = await apiService.getCurrentUser();
          if (response.success) {
            setCurrentUser(response.data);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
            apiService.setToken(null);
          }
        }
      } catch (error) {
        console.log('No valid session found');
        localStorage.removeItem('authToken');
        apiService.setToken(null);
      }
    };

    initializeSession();
  }, []);

  // User operations
  const loginUser = async (email: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.loginUser({ email, password });
      
      if (response.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        setCurrentUser(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData: { name: string; email: string; password: string }): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.registerUser(userData);
      
      if (response.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        setCurrentUser(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateUserSettings = async (settings: Partial<User['settings']>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.updateUserSettings(settings);
      
      if (response.success && currentUser) {
        setCurrentUser({ ...currentUser, settings: { ...currentUser.settings, ...settings } });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    apiService.setToken(null);
    localStorage.removeItem('authToken');
  };

  // Mood tracking operations
  const addMoodEntry = async (moodData: Omit<MoodEntry, '_id' | 'userId' | 'createdAt'>): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.addMoodEntry(moodData);
      
      if (response.success) {
        return response.data._id;
      } else {
        throw new Error(response.message || 'Failed to add mood entry');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add mood entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEntries = async (limitCount: number = 30, page: number = 1): Promise<MoodEntry[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getMoodEntries(limitCount, page);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get mood entries');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get mood entries';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMoodStats = async (days: number = 30): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getMoodStats(days);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get mood stats');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get mood stats';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateMoodEntry = async (moodId: string, updates: Partial<MoodEntry>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.updateMoodEntry(moodId, updates);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update mood entry');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update mood entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteMoodEntry = async (moodId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.deleteMoodEntry(moodId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete mood entry');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete mood entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Timer session operations
  const addTimerSession = async (sessionData: Omit<TimerSession, '_id' | 'userId' | 'startTime'>): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.addTimerSession(sessionData);
      
      if (response.success) {
        return response.data._id;
      } else {
        throw new Error(response.message || 'Failed to add timer session');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add timer session';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateTimerSession = async (sessionId: string, updates: Partial<TimerSession>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.updateTimerSession(sessionId, updates);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update timer session');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update timer session';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const completeTimerSession = async (sessionId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.completeTimerSession(sessionId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to complete timer session');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete timer session';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTimerSessions = async (limitCount: number = 50, page: number = 1, completed?: boolean): Promise<TimerSession[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getTimerSessions(limitCount, page, completed);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get timer sessions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get timer sessions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTimerStats = async (days: number = 30): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getTimerStats(days);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get timer stats');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get timer stats';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteTimerSession = async (sessionId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.deleteTimerSession(sessionId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete timer session');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete timer session';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value: DatabaseContextType = {
    currentUser,
    loginUser,
    registerUser,
    updateUserSettings,
    logoutUser,
    addMoodEntry,
    getMoodEntries,
    getMoodStats,
    updateMoodEntry,
    deleteMoodEntry,
    addTimerSession,
    updateTimerSession,
    completeTimerSession,
    getTimerSessions,
    getTimerStats,
    deleteTimerSession,
    loading,
    error
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
