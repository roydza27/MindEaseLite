import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Activity from '../components/Activity';
import AppearanceSettings from '../components/AppearanceSettings';
import BlockKit from '../components/BlockKit';
import BottomNavigation from '../components/BottomNavigation';
import Dashboard from '../components/Dashboard';
import LanguageSettings from '../components/LanguageSettings';
import Settings from '../components/Settings';
import SplashScreen from '../components/SplashScreen';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

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
            onThemeChange={setTheme}
          />
        ) : currentScreen === 'language' ? (
          <LanguageSettings 
            onNavigate={handleNavigate} 
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
        ) : (
          <>
            {activeTab === 'home' && <Dashboard onNavigate={handleNavigate} />}
            {activeTab === 'blockkit' && <BlockKit onNavigate={handleNavigate} />}
            {activeTab === 'mood-tracker' && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }}>
                <Text style={{ fontSize: 32, color: colors.primary, fontWeight: 'bold' }}>❤️ Mood Tracker</Text>
                <Text style={{ fontSize: 18, color: colors.primary, marginTop: 10 }}>Coming Soon!</Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 20, textAlign: 'center' }}>
                  Track your daily mood and emotional well-being
                </Text>
              </View>
            )}
            {activeTab === 'activity' && <Activity onNavigate={handleNavigate} />}
            {activeTab === 'settings' && <Settings onNavigate={handleNavigate} currentTheme={theme} onThemeChange={(theme: string) => setTheme(theme as 'light' | 'dark' | 'system')} currentLanguage={language} onLanguageChange={setLanguage} />}
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
});
