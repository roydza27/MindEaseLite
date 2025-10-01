import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Types for our data
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Timestamp;
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
  createdAt: Timestamp;
}

export interface TimerSession {
  id: string;
  userId: string;
  duration: number; // in minutes
  completed: boolean;
  startTime: Timestamp;
  endTime?: Timestamp;
  notes?: string;
}

export interface DatabaseContextType {
  // User operations
  currentUser: User | null;
  createUser: (userData: Partial<User>) => Promise<string>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  getUser: (userId: string) => Promise<User | null>;
  
  // Mood tracking operations
  addMoodEntry: (moodData: Omit<MoodEntry, 'id' | 'userId' | 'createdAt'>) => Promise<string>;
  getMoodEntries: (userId: string, limitCount?: number) => Promise<MoodEntry[]>;
  getMoodEntriesRealtime: (userId: string, callback: (entries: MoodEntry[]) => void) => () => void;
  
  // Timer session operations
  addTimerSession: (sessionData: Omit<TimerSession, 'id' | 'userId' | 'startTime'>) => Promise<string>;
  updateTimerSession: (sessionId: string, updates: Partial<TimerSession>) => Promise<void>;
  getTimerSessions: (userId: string, limitCount?: number) => Promise<TimerSession[]>;
  getTimerSessionsRealtime: (userId: string, callback: (sessions: TimerSession[]) => void) => () => void;
  
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

  // User operations
  const createUser = async (userData: Partial<User>): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const userRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: Timestamp.now(),
        settings: {
          theme: 'light',
          language: 'en',
          notifications: true,
          ...userData.settings
        }
      });
      
      return userRef.id;
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
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, updates);
      
      // Update current user if it's the same user
      if (currentUser && currentUser.id === userId) {
        setCurrentUser({ ...currentUser, ...updates });
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
      
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as User;
      }
      return null;
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
      
      const moodRef = await addDoc(collection(db, 'moodEntries'), {
        ...moodData,
        userId: currentUser.id,
        createdAt: Timestamp.now()
      });
      
      return moodRef.id;
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
      
      const q = query(
        collection(db, 'moodEntries'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MoodEntry[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get mood entries';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEntriesRealtime = (userId: string, callback: (entries: MoodEntry[]) => void) => {
    const q = query(
      collection(db, 'moodEntries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(30)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const entries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MoodEntry[];
      callback(entries);
    });
  };

  // Timer session operations
  const addTimerSession = async (sessionData: Omit<TimerSession, 'id' | 'userId' | 'startTime'>): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      const sessionRef = await addDoc(collection(db, 'timerSessions'), {
        ...sessionData,
        userId: currentUser.id,
        startTime: Timestamp.now()
      });
      
      return sessionRef.id;
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
      
      const sessionRef = doc(db, 'timerSessions', sessionId);
      await updateDoc(sessionRef, updates);
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
      
      const q = query(
        collection(db, 'timerSessions'),
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TimerSession[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get timer sessions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTimerSessionsRealtime = (userId: string, callback: (sessions: TimerSession[]) => void) => {
    const q = query(
      collection(db, 'timerSessions'),
      where('userId', '==', userId),
      orderBy('startTime', 'desc'),
      limit(50)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const sessions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TimerSession[];
      callback(sessions);
    });
  };

  const value: DatabaseContextType = {
    currentUser,
    createUser,
    updateUser,
    getUser,
    addMoodEntry,
    getMoodEntries,
    getMoodEntriesRealtime,
    addTimerSession,
    updateTimerSession,
    getTimerSessions,
    getTimerSessionsRealtime,
    loading,
    error
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
