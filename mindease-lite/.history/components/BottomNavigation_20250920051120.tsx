import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'home', label: t('nav.home'), icon: 'home-outline', activeIcon: 'home' },
    { id: 'blockkit', label: t('nav.blockkit'), icon: 'grid-outline', activeIcon: 'grid' },
    { id: 'mood-tracker', label: t('nav.moodTracker'), icon: 'heart-outline', activeIcon: 'heart' },
    { id: 'activity', label: t('nav.activity'), icon: 'bar-chart-outline', activeIcon: 'bar-chart-outline' },
    { id: 'settings', label: t('nav.settings'), icon: 'settings-outline', activeIcon: 'settings' },
  ];

  const getTabColor = (tabId: string) => {
    if (activeTab === tabId) {
      return isDark ? '#FFFFFF' : '#8B4513'; // White for dark theme, brown for light theme
    }
    return isDark ? '#D2B48C' : '#A0A0A0'; // Light brown for dark theme, gray for light theme
  };

  const getActiveTabBackground = () => {
    return isDark ? '#D2B48C' : '#F4E4BC'; // Light brown backgrounds
  };

  const getContainerBackground = () => {
    return isDark ? colors.surface : '#FFFFFF'; // Use app theme for dark mode
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Curved Navigation Container */}
      <View style={[styles.curvedContainer, { backgroundColor: getContainerBackground() }]}>
        {/* All Icons with Equal Spacing */}
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCentral = tab.id === 'mood-tracker';
          
          if (isCentral) {
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.centralButton}
                onPress={() => onTabPress(tab.id)}
              >
                <Ionicons name="heart" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            );
          }
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.iconContainer,
                isActive && { backgroundColor: getActiveTabBackground() }
              ]}
              onPress={() => onTabPress(tab.id)}
            >
              <Ionicons
                name={isActive ? (tab.activeIcon as any) : (tab.icon as any)}
                size={26}
                color={getTabColor(tab.id)}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  curvedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    borderRadius: 35,
    paddingHorizontal: 24,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50', // Green color like in the image
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});
