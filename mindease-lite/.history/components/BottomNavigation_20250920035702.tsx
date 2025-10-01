import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const { colors } = useTheme();
  
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { id: 'blockkit', label: 'BlockKit', icon: 'grid-outline', activeIcon: 'grid' },
    { id: 'mood-tracker', label: 'Mood Tracker', icon: 'heart-outline', activeIcon: 'heart' },
    { id: 'activity', label: 'Activity', icon: 'bar-chart-outline', activeIcon: 'bar-chart-outline' },
    { id: 'settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress(tab.id)}
          >
                  <Ionicons
                    name={isActive ? (tab.activeIcon as any) : (tab.icon as any)}
                    size={24}
                    color={isActive ? colors.primary : colors.textSecondary}
                  />
                  <Text style={[styles.tabLabel, { color: isActive ? colors.primary : colors.textSecondary }]}>
                    {tab.label}
                  </Text>
          </TouchableOpacity>
        );
      })}
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
