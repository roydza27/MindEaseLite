import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

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
    <ScrollView style={styles.container}>
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


      {/* App Theme Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('app-theme')}>
          <View style={styles.listItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="color-palette" size={20} color="#2C5F5D" />
            </View>
            <Text style={styles.listItemText}>App Theme</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>

      {/* Audio Settings Section */}
      <View style={styles.section}>
        <View style={styles.toggleItem}>
          <View style={styles.toggleItemLeft}>
            <Text style={styles.toggleItemText}>Allow Background Audio</Text>
          </View>
          <Switch
            value={allowBackgroundAudio}
            onValueChange={setAllowBackgroundAudio}
            trackColor={{ false: '#E0E0E0', true: '#2C5F5D' }}
            thumbColor={allowBackgroundAudio ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Distraction Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distraction Management</Text>
        
        <View style={styles.toggleItem}>
          <View style={styles.toggleItemLeft}>
            <Text style={styles.toggleItemText}>Focus Mode On</Text>
            <Text style={styles.toggleItemDescription}>Silence notifications during focus sessions.</Text>
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
            <Text style={styles.toggleItemDescription}>Temporarily disable access to social media.</Text>
          </View>
          <Switch
            value={blockSocialApps}
            onValueChange={setBlockSocialApps}
            trackColor={{ false: '#E0E0E0', true: '#2C5F5D' }}
            thumbColor={blockSocialApps ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Wellbeing Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wellbeing Features</Text>
        
        <View style={styles.toggleItem}>
          <View style={styles.toggleItemLeft}>
            <Text style={styles.toggleItemText}>Daily Mindfulness Reminders</Text>
            <Text style={styles.toggleItemDescription}>Receive gentle nudges for reflection and meditation.</Text>
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
            <Text style={styles.toggleItemText}>Integrate with Health App</Text>
          </View>
          <Switch
            value={integrateWithHealthApp}
            onValueChange={setIntegrateWithHealthApp}
            trackColor={{ false: '#E0E0E0', true: '#2C5F5D' }}
            thumbColor={integrateWithHealthApp ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={styles.resetItem}>
          <View style={styles.resetItemLeft}>
            <Text style={styles.resetItemText}>Reset Wellbeing Data</Text>
            <Text style={styles.resetItemDescription}>Permanently delete all mood logs and progress data.</Text>
          </View>
          <TouchableOpacity style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        
        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('notifications')}>
          <View style={styles.listItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={20} color="#2C5F5D" />
            </View>
            <Text style={styles.listItemText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('appearance')}>
          <View style={styles.listItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="moon" size={20} color="#2C5F5D" />
            </View>
            <Text style={styles.listItemText}>Appearance</Text>
          </View>
          <View style={styles.listItemRight}>
            <Text style={styles.settingValue}>Light</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('language')}>
          <View style={styles.listItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="globe" size={20} color="#2C5F5D" />
            </View>
            <Text style={styles.listItemText}>Language</Text>
          </View>
          <View style={styles.listItemRight}>
            <Text style={styles.settingValue}>English</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </View>
        </TouchableOpacity>
      </View>


      {/* About MindEase Lite Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About MindEase Lite</Text>
        
        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('help')}>
          <View style={styles.listItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="help-circle" size={20} color="#2C5F5D" />
            </View>
            <Text style={styles.listItemText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('terms')}>
          <View style={styles.listItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-text" size={20} color="#2C5F5D" />
            </View>
            <Text style={styles.listItemText}>Terms of Service</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listItemText: {
    fontSize: 16,
    color: '#000000',
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  toggleItemLeft: {
    flex: 1,
    marginRight: 16,
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resetItemLeft: {
    flex: 1,
    marginRight: 16,
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
