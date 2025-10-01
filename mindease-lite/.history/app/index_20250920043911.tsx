import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Activity from '../components/Activity';
import AppearanceSettings from '../components/AppearanceSettings';
import BlockKit from '../components/BlockKit';
import BottomNavigation from '../components/BottomNavigation';
import Dashboard from '../components/Dashboard';
import LanguageSettings from '../components/LanguageSettings';
import MoodTracker from '../components/MoodTracker';
import Settings from '../components/Settings';
import SplashScreen from '../components/SplashScreen';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('main');
  const { theme, setTheme, colors } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleTabPress = (tab: string) => {
    console.log('Tab pressed:', tab);
    setActiveTab(tab);
    setCurrentScreen('main');
  };

  const handleNavigate = (screen: string) => {
    console.log(`Navigate to: ${screen}`);
    if (screen === 'appearance') {
      setCurrentScreen('appearance');
    } else if (screen === 'language') {
      setCurrentScreen('language');
    } else if (screen === 'settings') {
      setCurrentScreen('main');
      setActiveTab('settings');
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {currentScreen === 'appearance' ? (
          <AppearanceSettings 
            onNavigate={handleNavigate} 
            currentTheme={theme}
            onThemeChange={(theme: string) => setTheme(theme as 'light' | 'dark' | 'system')}
          />
        ) : currentScreen === 'language' ? (
          <LanguageSettings 
            onNavigate={handleNavigate} 
            currentLanguage={language}
            onLanguageChange={(language: string) => setLanguage(language as 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ja' | 'ko' | 'zh' | 'ar' | 'hi')}
          />
        ) : (
          <>
            {activeTab === 'home' && <Dashboard onNavigate={handleNavigate} />}
            {activeTab === 'blockkit' && <BlockKit onNavigate={handleNavigate} />}
            {activeTab === 'mood-tracker' && <MoodTracker onNavigate={handleNavigate} />}
            {activeTab === 'activity' && <Activity onNavigate={handleNavigate} />}
            {activeTab === 'settings' && <Settings onNavigate={handleNavigate} currentTheme={theme} onThemeChange={(theme: string) => setTheme(theme as 'light' | 'dark' | 'system')} currentLanguage={language} onLanguageChange={(language: string) => setLanguage(language as 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ja' | 'ko' | 'zh' | 'ar' | 'hi')} />}
          </>
        )}
      </View>
      {currentScreen === 'main' && <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />}
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  // Mood Tracker Header Styles
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
  // Account Popup Styles
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  popupContainer: {
    position: 'absolute',
    top: 110, // Increased from 90 to create proper spacing below the profile icon
    right: 20,
    zIndex: 1000,
  },
  accountPopup: {
    width: 280,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  popupArrow: {
    position: 'absolute',
    top: -8,
    right: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
  },
  accountOptions: {
    marginTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
});
