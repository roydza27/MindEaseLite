import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SettingsProps {
  onNavigate: (screen: string) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Ionicons name="person-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Profile Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            <Ionicons name="person" size={60} color="#FFFFFF" />
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.textInput}
            value="Jane Doe"
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value="jane.doe@example.com"
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.textInput}
            value="••••••••"
            placeholder="Enter your password"
            secureTextEntry
          />
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

      {/* Privacy & Security Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        
        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('privacy')}>
          <View style={styles.listItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={20} color="#2C5F5D" />
            </View>
            <Text style={styles.listItemText}>Privacy Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('data-export')}>
          <View style={styles.listItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="download" size={20} color="#2C5F5D" />
            </View>
            <Text style={styles.listItemText}>Export Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('delete-account')}>
          <View style={styles.listItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="trash" size={20} color="#FF4444" />
            </View>
            <Text style={[styles.listItemText, { color: '#FF4444' }]}>Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
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

        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('privacy-policy')}>
          <View style={styles.listItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={20} color="#2C5F5D" />
            </View>
            <Text style={styles.listItemText}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => onNavigate('about-us')}>
          <View style={styles.listItemLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle" size={20} color="#2C5F5D" />
            </View>
            <Text style={styles.listItemText}>About Us</Text>
          </View>
          <View style={styles.listItemRight}>
            <Text style={styles.settingValue}>v1.0.0</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
          </View>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>MindEase Lite</Text>
        <Text style={styles.footerSubtext}>Your mental wellness companion</Text>
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
  profileIcon: {
    padding: 4,
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
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFB6C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C5F5D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
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
});
