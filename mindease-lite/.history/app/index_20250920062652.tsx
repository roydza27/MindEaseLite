import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Activity from '../components/Activity';
import AppearanceSettings from '../components/AppearanceSettings';
import BlockKit from '../components/BlockKit';
import BottomNavigation from '../components/BottomNavigation';
import Dashboard from '../components/Dashboard';
import LanguageSettings from '../components/LanguageSettings';
import MoodTracker from '../components/MoodTracker';
import Settings from '../components/Settings';
import SplashScreen from '../components/SplashScreen';
import { DatabaseProvider } from '../contexts/DatabaseContext';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('main');
  const { theme, setTheme, colors } = useTheme();
  const { language, setLanguage } = useLanguage();
  
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
    <DatabaseProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </LanguageProvider>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
