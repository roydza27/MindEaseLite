import React, { createContext, ReactNode, useContext, useState } from 'react';
import { apiService, User, MoodEntry, TimerSession } from '../services/apiService';

export interface ApiContextType {
  // User operations
  currentUser: User | null;
  createUser: (userData: Partial<User>) => Promise<string>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  getUser: (userId: string) => Promise<User | null>;
  
  // Mood tracking operations
  addMoodEntry: (moodData: Omit<MoodEntry, 'id' | 'userId' | 'createdAt'>) => Promise<string>;
  getMoodEntries: (userId: string, limitCount?: number) => Promise<MoodEntry[]>;
  
  // Timer session operations
  addTimerSession: (sessionData: Omit<TimerSession, 'id' | 'userId' | 'startTime'>) => Promise<string>;
  updateTimerSession: (sessionId: string, updates: Partial<TimerSession>) => Promise<void>;
  getTimerSessions: (userId: string, limitCount?: number) => Promise<TimerSession[]>;
  
  // Loading states
  loading: boolean;
  error: string | null;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User operations
  const createUser = async (userData: Partial<User>): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await apiService.createUser(userData);
      setCurrentUser(user);
      return user.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await apiService.updateUser(userId, updates);
      
      // Update current user if it's the same user
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(user);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (userId: string): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await apiService.getUser(userId);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Mood tracking operations
  const addMoodEntry = async (moodData: Omit<MoodEntry, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      const moodEntry = await apiService.addMoodEntry(moodData);
      return moodEntry.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add mood entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEntries = async (userId: string, limitCount: number = 30): Promise<MoodEntry[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const entries = await apiService.getMoodEntries(userId, limitCount);
      return entries;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get mood entries';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Timer session operations
  const addTimerSession = async (sessionData: Omit<TimerSession, 'id' | 'userId' | 'startTime'>): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      const session = await apiService.addTimerSession(sessionData);
      return session.id;
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
      
      await apiService.updateTimerSession(sessionId, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update timer session';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTimerSessions = async (userId: string, limitCount: number = 50): Promise<TimerSession[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const sessions = await apiService.getTimerSessions(userId, limitCount);
      return sessions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get timer sessions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value: ApiContextType = {
    currentUser,
    createUser,
    updateUser,
    getUser,
    addMoodEntry,
    getMoodEntries,
    addTimerSession,
    updateTimerSession,
    getTimerSessions,
    loading,
    error
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};
