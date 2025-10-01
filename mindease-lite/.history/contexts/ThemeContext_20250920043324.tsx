import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    accent: string;
    border: string;
    cardBackground: string;
    headerBackground: string;
  };
}

const lightColors = {
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#666666',
  primary: '#2C5F5D',
  accent: '#E6F4FE',
  border: '#F0F0F0',
  cardBackground: '#FFFFFF',
  headerBackground: '#FFFFFF',
};

const darkColors = {
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  primary: '#4A9B9B',
  accent: '#1A3A3A',
  border: '#38383A',
  cardBackground: '#1C1C1E',
  headerBackground: '#1C1C1E',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    // Get initial system theme
    setSystemTheme(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');

    return () => subscription?.remove();
  }, []);

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  const value: ThemeContextType = {
    theme,
    isDark,
    setTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
