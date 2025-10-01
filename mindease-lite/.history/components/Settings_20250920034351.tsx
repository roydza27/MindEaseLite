import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
  onNavigate: (screen: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
}

export default function Settings({ onNavigate, currentTheme = 'light', onThemeChange }: SettingsProps) {
  const { colors, isDark } = useTheme();
  
  // Toggle states
  const [allowBackgroundAudio, setAllowBackgroundAudio] = useState(true);
  const [focusModeOn, setFocusModeOn] = useState(false);
  const [blockSocialApps, setBlockSocialApps] = useState(false);
  const [dailyMindfulnessReminders, setDailyMindfulnessReminders] = useState(true);
  const [integrateWithHealthApp, setIntegrateWithHealthApp] = useState(false);
  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        nestedScrollEnabled={true}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <TouchableOpacity style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>


        {/* Personalization Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Personalization</Text>
          
          <View style={[styles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
            <TouchableOpacity style={[styles.listItem, { borderBottomColor: colors.border }]} onPress={() => onNavigate('appearance')}>
              <View style={styles.listItemLeft}>
                <Text style={[styles.listItemText, { color: colors.text }]}>Appearance</Text>
              </View>
              <View style={styles.listItemRight}>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]} onPress={() => onNavigate('language')}>
              <View style={styles.listItemLeft}>
                <Text style={[styles.listItemText, { color: colors.text }]}>Language</Text>
              </View>
              <View style={styles.listItemRight}>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>English</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

      {/* Audio & Media Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Audio & Media</Text>

        <View style={[styles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.toggleItem, { borderBottomWidth: 0 }]}>
            <View style={styles.toggleItemLeft}>
              <Text style={[styles.toggleItemText, { color: colors.text }]}>Allow Background Audio</Text>
              <Text style={[styles.toggleItemDescription, { color: colors.textSecondary }]}>Continue playing audio when app is in background</Text>
            </View>
            <Switch
              value={allowBackgroundAudio}
              onValueChange={setAllowBackgroundAudio}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={allowBackgroundAudio ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>
      </View>

      {/* Focus & Productivity Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Focus & Productivity</Text>
        
        <View style={[styles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.toggleItem, { borderBottomColor: colors.border }]}>
            <View style={styles.toggleItemLeft}>
              <Text style={[styles.toggleItemText, { color: colors.text }]}>Focus Mode</Text>
              <Text style={[styles.toggleItemDescription, { color: colors.textSecondary }]}>Silence notifications during focus sessions</Text>
            </View>
            <Switch
              value={focusModeOn}
              onValueChange={setFocusModeOn}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={focusModeOn ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <View style={[styles.toggleItem, { borderBottomWidth: 0 }]}>
            <View style={styles.toggleItemLeft}>
              <Text style={[styles.toggleItemText, { color: colors.text }]}>Block Social Apps</Text>
              <Text style={[styles.toggleItemDescription, { color: colors.textSecondary }]}>Temporarily disable access to social media</Text>
            </View>
            <Switch
              value={blockSocialApps}
              onValueChange={setBlockSocialApps}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={blockSocialApps ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>
      </View>

      {/* Wellness & Health Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Wellness & Health</Text>
        
        <View style={[styles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.toggleItem, { borderBottomColor: colors.border }]}>
            <View style={styles.toggleItemLeft}>
              <Text style={[styles.toggleItemText, { color: colors.text }]}>Daily Mindfulness Reminders</Text>
              <Text style={[styles.toggleItemDescription, { color: colors.textSecondary }]}>Receive gentle nudges for reflection and meditation</Text>
            </View>
            <Switch
              value={dailyMindfulnessReminders}
              onValueChange={setDailyMindfulnessReminders}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={dailyMindfulnessReminders ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <View style={[styles.toggleItem, { borderBottomWidth: 0 }]}>
            <View style={styles.toggleItemLeft}>
              <Text style={[styles.toggleItemText, { color: colors.text }]}>Health App Integration</Text>
              <Text style={[styles.toggleItemDescription, { color: colors.textSecondary }]}>Sync data with your device's health app</Text>
            </View>
            <Switch
              value={integrateWithHealthApp}
              onValueChange={setIntegrateWithHealthApp}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={integrateWithHealthApp ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>
      </View>

      {/* Data Management Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Data Management</Text>
        
        <View style={[styles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.resetItem, { borderBottomWidth: 0 }]}>
            <View style={styles.resetItemLeft}>
              <Text style={[styles.resetItemText, { color: colors.text }]}>Reset Wellbeing Data</Text>
              <Text style={[styles.resetItemDescription, { color: colors.textSecondary }]}>Permanently delete all mood logs and progress data</Text>
            </View>
            <TouchableOpacity style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Notifications</Text>
        
        <View style={[styles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]} onPress={() => onNavigate('notifications')}>
            <View style={styles.listItemLeft}>
              <Text style={[styles.listItemText, { color: colors.text }]}>Notification Settings</Text>
              <Text style={[styles.listItemDescription, { color: colors.textSecondary }]}>Manage push notifications and alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>


      {/* Support & Legal Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Support & Legal</Text>
        
        <View style={[styles.sectionContainer, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity style={[styles.listItem, { borderBottomColor: colors.border }]} onPress={() => onNavigate('help')}>
            <View style={styles.listItemLeft}>
              <Text style={[styles.listItemText, { color: colors.text }]}>Help & Support</Text>
              <Text style={[styles.listItemDescription, { color: colors.textSecondary }]}>Get help and contact support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]} onPress={() => onNavigate('terms')}>
            <View style={styles.listItemLeft}>
              <Text style={[styles.listItemText, { color: colors.text }]}>Terms of Service</Text>
              <Text style={[styles.listItemDescription, { color: colors.textSecondary }]}>Read our terms and conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 44, // Status bar height for most devices
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  profileContainer: {
    position: 'relative',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFB6C1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4444',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C5F5D',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: 'transparent',
  },
  listItemLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  listItemText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  listItemDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#999999',
    marginRight: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C5F5D',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#666666',
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: 'transparent',
  },
  toggleItemLeft: {
    flex: 1,
    marginRight: 16,
    justifyContent: 'center',
  },
  toggleItemText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  toggleItemDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  resetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: 'transparent',
  },
  resetItemLeft: {
    flex: 1,
    marginRight: 16,
    justifyContent: 'center',
  },
  resetItemText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  resetItemDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#FF4444',
    fontWeight: '600',
  },
});
