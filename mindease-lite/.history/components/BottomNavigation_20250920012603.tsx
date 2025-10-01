import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { id: 'blockkit', label: 'BlockKit', icon: 'grid-outline', activeIcon: 'grid' },
    { id: 'activity', label: 'Activity', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
    { id: 'settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
    { id: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress(tab.id)}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={isActive ? '#2C5F5D' : '#999999'}
            />
            <Text style={[styles.tabLabel, { color: isActive ? '#2C5F5D' : '#999999' }]}>
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
