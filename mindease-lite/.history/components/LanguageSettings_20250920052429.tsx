import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface LanguageSettingsProps {
  onNavigate: (screen: string) => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function LanguageSettings({ onNavigate, currentLanguage, onLanguageChange }: LanguageSettingsProps) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  
  const languages = [
    { id: 'en', label: 'English', description: 'English', icon: 'globe' },
    { id: 'es', label: 'Español', description: 'Spanish', icon: 'globe' },
    { id: 'fr', label: 'Français', description: 'French', icon: 'globe' },
    { id: 'de', label: 'Deutsch', description: 'German', icon: 'globe' },
    { id: 'it', label: 'Italiano', description: 'Italian', icon: 'globe' },
    { id: 'pt', label: 'Português', description: 'Portuguese', icon: 'globe' },
    { id: 'ru', label: 'Русский', description: 'Russian', icon: 'globe' },
    { id: 'ja', label: '日本語', description: 'Japanese', icon: 'globe' },
    { id: 'ko', label: '한국어', description: 'Korean', icon: 'globe' },
    { id: 'zh', label: '中文', description: 'Chinese', icon: 'globe' },
    { id: 'ar', label: 'العربية', description: 'Arabic', icon: 'globe' },
    { id: 'hi', label: 'हिन्दी', description: 'Hindi', icon: 'globe' },
  ];

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.surface }]}
        contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.surface }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => onNavigate('settings')} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
            <Text style={[styles.backText, { color: colors.primary }]}>{t('nav.settings')}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('language.title')}</Text>
          <View style={{ width: 80 }} /> {/* Placeholder for alignment */}
        </View>

        {/* Language Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('language.sectionTitle')}</Text>
          
          <View style={[styles.optionsContainer, { backgroundColor: colors.background }]}>
            {languages.map((language, index) => (
              <View key={language.id}>
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    { backgroundColor: colors.background },
                    index === 0 && styles.firstOption,
                    index === languages.length - 1 && styles.lastOption,
                    currentLanguage === language.id && { backgroundColor: colors.surface }
                  ]}
                  onPress={() => {
                    onLanguageChange(language.id);
                    // Navigate back to settings after language change
                    setTimeout(() => onNavigate('settings'), 100);
                  }}
                >
                  <View style={styles.optionLeft}>
                    <View style={[
                      styles.iconContainer,
                      { backgroundColor: colors.surface },
                      currentLanguage === language.id && { backgroundColor: colors.primary }
                    ]}>
                      <Ionicons 
                        name={language.icon as any} 
                        size={20} 
                        color={currentLanguage === language.id ? '#FFFFFF' : colors.primary} 
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text style={[
                        styles.optionTitle,
                        { color: colors.text },
                        currentLanguage === language.id && { color: colors.primary }
                      ]}>
                        {language.label}
                      </Text>
                      <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                        {language.description}
                      </Text>
                    </View>
                  </View>
                  {currentLanguage === language.id && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
                {index < languages.length - 1 && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
              </View>
            ))}
          </View>
        </View>

        {/* Info Text */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {t('language.info')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 44,
  },
  container: {
    flex: 1,
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
    borderBottomWidth: 0.5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 17,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '400',
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
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '400',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
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
    lineHeight: 18,
    textAlign: 'center',
  },
});
