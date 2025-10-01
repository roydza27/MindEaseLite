import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface AppearanceSettingsProps {
  onNavigate: (screen: string) => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function AppearanceSettings({ onNavigate, currentTheme, onThemeChange }: AppearanceSettingsProps) {
  const { colors, isDark } = useTheme();
  const themes = [
    { id: 'light', label: 'Light', description: 'Always use light mode', icon: 'sunny' },
    { id: 'dark', label: 'Dark', description: 'Always use dark mode', icon: 'moon' },
    { id: 'system', label: 'System', description: 'Follow system settings', icon: 'phone-portrait' },
  ];

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onNavigate('settings')} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
            <Text style={styles.backText}>Settings</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appearance</Text>
          <View style={{ width: 80 }} /> {/* Placeholder for alignment */}
        </View>

        {/* Theme Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APPEARANCE</Text>
          
          <View style={styles.optionsContainer}>
            {themes.map((theme, index) => (
              <View key={theme.id}>
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    index === 0 && styles.firstOption,
                    index === themes.length - 1 && styles.lastOption,
                    currentTheme === theme.id && styles.selectedOption
                  ]}
                  onPress={() => onThemeChange(theme.id)}
                >
                  <View style={styles.optionLeft}>
                    <View style={[
                      styles.iconContainer,
                      currentTheme === theme.id && styles.selectedIconContainer
                    ]}>
                      <Ionicons 
                        name={theme.icon as any} 
                        size={20} 
                        color={currentTheme === theme.id ? '#FFFFFF' : '#2C5F5D'} 
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text style={[
                        styles.optionTitle,
                        currentTheme === theme.id && styles.selectedOptionTitle
                      ]}>
                        {theme.label}
                      </Text>
                      <Text style={styles.optionDescription}>
                        {theme.description}
                      </Text>
                    </View>
                  </View>
                  {currentTheme === theme.id && (
                    <Ionicons name="checkmark" size={20} color="#2C5F5D" />
                  )}
                </TouchableOpacity>
                {index < themes.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </View>

        {/* Info Text */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Choose how MindEase Lite appears. System will automatically switch between light and dark based on your device settings.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: 44,
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 17,
    color: '#2C5F5D',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93',
    marginBottom: 8,
    marginLeft: 16,
    letterSpacing: -0.08,
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  firstOption: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  lastOption: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  selectedOption: {
    backgroundColor: '#F2F2F7',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedIconContainer: {
    backgroundColor: '#2C5F5D',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 2,
  },
  selectedOptionTitle: {
    color: '#2C5F5D',
  },
  optionDescription: {
    fontSize: 13,
    color: '#8E8E93',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#C6C6C8',
    marginLeft: 60,
  },
  infoSection: {
    marginTop: 32,
    paddingHorizontal: 32,
  },
  infoText: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    textAlign: 'center',
  },
});
