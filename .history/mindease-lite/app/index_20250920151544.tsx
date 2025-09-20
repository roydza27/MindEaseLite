import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
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
  const [showSplash, setShowSplash] = useState(false); // Skip splash screen for now
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
        <Text style={{ color: colors.text, fontSize: 24, textAlign: 'center', marginTop: 50 }}>
          MindEase Lite - App Loaded Successfully! 🎉
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center', marginTop: 20 }}>
          Current Tab: {activeTab}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center', marginTop: 10 }}>
          Theme: {theme}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center', marginTop: 10 }}>
          Language: {language}
        </Text>
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
});
