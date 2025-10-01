import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const { width } = Dimensions.get('window');

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Curved Navigation Container */}
      <View style={[styles.curvedContainer, { backgroundColor: isDark ? '#8B4513' : '#FFFFFF' }]}>
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

        {/* Central Add Button */}
        <TouchableOpacity
          style={styles.centralButton}
          onPress={() => onTabPress('mood-tracker')}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
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
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
