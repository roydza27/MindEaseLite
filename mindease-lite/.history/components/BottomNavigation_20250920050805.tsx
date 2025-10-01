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
        {/* Left Side Icons */}
        <View style={styles.leftIcons}>
          {tabs.slice(0, 2).map((tab) => {
            const isActive = activeTab === tab.id;
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
                  size={22}
                  color={getTabColor(tab.id)}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Central Heart Button */}
        <TouchableOpacity
          style={styles.centralButton}
          onPress={() => onTabPress('mood-tracker')}
        >
          <Ionicons name="heart" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Right Side Icons */}
        <View style={styles.rightIcons}>
          {tabs.slice(3, 5).map((tab) => {
            const isActive = activeTab === tab.id;
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
                  size={22}
                  color={getTabColor(tab.id)}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  curvedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 65,
    borderRadius: 32,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 8,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  centralButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    marginHorizontal: 8,
  },
});
