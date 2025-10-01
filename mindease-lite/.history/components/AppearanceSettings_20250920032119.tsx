import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AppearanceSettingsProps {
  visible: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function AppearanceSettings({ visible, onClose, currentTheme, onThemeChange }: AppearanceSettingsProps) {
  const themes = [
    { id: 'light', label: 'Light', description: 'Always use light mode', icon: 'sunny' },
    { id: 'dark', label: 'Dark', description: 'Always use dark mode', icon: 'moon' },
    { id: 'system', label: 'System', description: 'Follow system settings', icon: 'phone-portrait' },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Appearance</Text>
            <View style={{ width: 24 }} /> {/* Placeholder for alignment */}
          </View>

          {/* Theme Options */}
          <View style={styles.optionsContainer}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.optionItem,
                  currentTheme === theme.id && styles.selectedOption
                ]}
                onPress={() => {
                  onThemeChange(theme.id);
                  onClose();
                }}
              >
                <View style={styles.optionLeft}>
                  <View style={[
                    styles.iconContainer,
                    currentTheme === theme.id && styles.selectedIconContainer
                  ]}>
                    <Ionicons 
                      name={theme.icon as any} 
                      size={24} 
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
                  <Ionicons name="checkmark-circle" size={24} color="#2C5F5D" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Info Text */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Choose how MindEase Lite appears. System will automatically switch between light and dark based on your device settings.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#E6F4FE',
    borderColor: '#2C5F5D',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedIconContainer: {
    backgroundColor: '#2C5F5D',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  selectedOptionTitle: {
    color: '#2C5F5D',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  infoContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2C5F5D',
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});
