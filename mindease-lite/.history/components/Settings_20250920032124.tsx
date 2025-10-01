import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import AppearanceSettings from './AppearanceSettings';

interface SettingsProps {
  onNavigate: (screen: string) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  // Toggle states
  const [allowBackgroundAudio, setAllowBackgroundAudio] = useState(true);
  const [focusModeOn, setFocusModeOn] = useState(false);
  const [blockSocialApps, setBlockSocialApps] = useState(false);
  const [dailyMindfulnessReminders, setDailyMindfulnessReminders] = useState(true);
  const [integrateWithHealthApp, setIntegrateWithHealthApp] = useState(false);
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        nestedScrollEnabled={true}
      >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>


      {/* Personalization Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalization</Text>
        
        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('appearance')}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listItemText}>Appearance</Text>
          </View>
          <View style={styles.listItemRight}>
            <Text style={styles.settingValue}>Light</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('language')}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listItemText}>Language</Text>
          </View>
          <View style={styles.listItemRight}>
            <Text style={styles.settingValue}>English</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Audio & Media Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio & Media</Text>
        
        <View style={styles.toggleItem}>
          <View style={styles.toggleItemLeft}>
            <Text style={styles.toggleItemText}>Allow Background Audio</Text>
            <Text style={styles.toggleItemDescription}>Continue playing audio when app is in background</Text>
          </View>
          <Switch
            value={allowBackgroundAudio}
            onValueChange={setAllowBackgroundAudio}
            trackColor={{ false: '#E0E0E0', true: '#2C5F5D' }}
            thumbColor={allowBackgroundAudio ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Focus & Productivity Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Focus & Productivity</Text>
        
        <View style={styles.toggleItem}>
          <View style={styles.toggleItemLeft}>
            <Text style={styles.toggleItemText}>Focus Mode</Text>
            <Text style={styles.toggleItemDescription}>Silence notifications during focus sessions</Text>
          </View>
          <Switch
            value={focusModeOn}
            onValueChange={setFocusModeOn}
            trackColor={{ false: '#E0E0E0', true: '#2C5F5D' }}
            thumbColor={focusModeOn ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={styles.toggleItem}>
          <View style={styles.toggleItemLeft}>
            <Text style={styles.toggleItemText}>Block Social Apps</Text>
            <Text style={styles.toggleItemDescription}>Temporarily disable access to social media</Text>
          </View>
          <Switch
            value={blockSocialApps}
            onValueChange={setBlockSocialApps}
            trackColor={{ false: '#E0E0E0', true: '#2C5F5D' }}
            thumbColor={blockSocialApps ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Wellness & Health Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wellness & Health</Text>
        
        <View style={styles.toggleItem}>
          <View style={styles.toggleItemLeft}>
            <Text style={styles.toggleItemText}>Daily Mindfulness Reminders</Text>
            <Text style={styles.toggleItemDescription}>Receive gentle nudges for reflection and meditation</Text>
          </View>
          <Switch
            value={dailyMindfulnessReminders}
            onValueChange={setDailyMindfulnessReminders}
            trackColor={{ false: '#E0E0E0', true: '#2C5F5D' }}
            thumbColor={dailyMindfulnessReminders ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={styles.toggleItem}>
          <View style={styles.toggleItemLeft}>
            <Text style={styles.toggleItemText}>Health App Integration</Text>
            <Text style={styles.toggleItemDescription}>Sync data with your device's health app</Text>
          </View>
          <Switch
            value={integrateWithHealthApp}
            onValueChange={setIntegrateWithHealthApp}
            trackColor={{ false: '#E0E0E0', true: '#2C5F5D' }}
            thumbColor={integrateWithHealthApp ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Data Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <View style={styles.resetItem}>
          <View style={styles.resetItemLeft}>
            <Text style={styles.resetItemText}>Reset Wellbeing Data</Text>
            <Text style={styles.resetItemDescription}>Permanently delete all mood logs and progress data</Text>
          </View>
          <TouchableOpacity style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('notifications')}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listItemText}>Notification Settings</Text>
            <Text style={styles.listItemDescription}>Manage push notifications and alerts</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>


      {/* Support & Legal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        
        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('help')}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listItemText}>Help & Support</Text>
            <Text style={styles.listItemDescription}>Get help and contact support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('terms')}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listItemText}>Terms of Service</Text>
            <Text style={styles.listItemDescription}>Read our terms and conditions</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
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
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 2,
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
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 2,
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
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 2,
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
