import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Activity from '../components/Activity';
import AppearanceSettings from '../components/AppearanceSettings';
import BlockKit from '../components/BlockKit';
import BottomNavigation from '../components/BottomNavigation';
import Dashboard from '../components/Dashboard';
import LanguageSettings from '../components/LanguageSettings';
import Settings from '../components/Settings';
import SplashScreen from '../components/SplashScreen';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('main');
  const [showAccountPopup, setShowAccountPopup] = useState(false);
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
            {activeTab === 'mood-tracker' && (
              <View style={{ flex: 1, backgroundColor: colors.background }}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.background }]}>
                  <Text style={[styles.headerTitle, { color: colors.text }]}>{t('moodTracker.title')}</Text>
                  <TouchableOpacity style={styles.profileContainer} onPress={() => setShowAccountPopup(true)}>
                    <View style={styles.profileIcon}>
                      <Ionicons name="person" size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.notificationDot} />
                  </TouchableOpacity>
                </View>

                {/* Main Content */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }}>
                  <Text style={{ fontSize: 32, color: colors.primary, fontWeight: 'bold' }}>{t('moodTracker.title')}</Text>
                  <Text style={{ fontSize: 18, color: colors.primary, marginTop: 10 }}>{t('moodTracker.comingSoon')}</Text>
                  <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 20, textAlign: 'center' }}>
                    {t('moodTracker.description')}
                  </Text>
                </View>

                {/* Account Popup - Positioned below profile icon */}
                {showAccountPopup && (
                  <>
                    {/* Overlay to close popup when tapping outside */}
                    <TouchableOpacity 
                      style={styles.popupOverlay} 
                      activeOpacity={1} 
                      onPress={() => setShowAccountPopup(false)}
                    />
                    <View style={styles.popupContainer}>
                      <View style={[styles.accountPopup, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
                        {/* Popup Arrow */}
                        <View style={[styles.popupArrow, { borderBottomColor: 'rgba(255, 255, 255, 0.95)' }]} />
                        
                        <View style={styles.popupHeader}>
                          <Text style={[styles.popupTitle, { color: '#2C5F5D' }]}>Account</Text>
                          <TouchableOpacity onPress={() => setShowAccountPopup(false)}>
                            <Ionicons name="close" size={20} color="#666666" />
                          </TouchableOpacity>
                        </View>
                        
                        <View style={styles.userInfo}>
                          <View style={[styles.avatar, { backgroundColor: '#2C5F5D' }]}>
                            <Ionicons name="person" size={28} color="#FFFFFF" />
                          </View>
                          <View style={styles.userDetails}>
                            <Text style={[styles.userName, { color: '#2C5F5D' }]}>Alex Johnson</Text>
                            <Text style={[styles.userEmail, { color: '#666666' }]}>alex.johnson@email.com</Text>
                          </View>
                        </View>

                        <View style={styles.accountOptions}>
                          <TouchableOpacity style={[styles.optionItem, { borderBottomColor: 'rgba(0, 0, 0, 0.1)' }]}>
                            <View style={[styles.optionIcon, { backgroundColor: 'rgba(44, 95, 93, 0.1)' }]}>
                              <Ionicons name="settings" size={18} color="#2C5F5D" />
                            </View>
                            <Text style={[styles.optionText, { color: '#2C5F5D' }]}>Manage Account</Text>
                            <Ionicons name="chevron-forward" size={16} color="#999999" />
                          </TouchableOpacity>
                          
                          <TouchableOpacity style={[styles.optionItem, { borderBottomColor: 'rgba(0, 0, 0, 0.1)' }]}>
                            <View style={[styles.optionIcon, { backgroundColor: 'rgba(44, 95, 93, 0.1)' }]}>
                              <Ionicons name="trophy" size={18} color="#2C5F5D" />
                            </View>
                            <Text style={[styles.optionText, { color: '#2C5F5D' }]}>Rewards</Text>
                            <Ionicons name="chevron-forward" size={16} color="#999999" />
                          </TouchableOpacity>
                          
                          <TouchableOpacity style={[styles.optionItem, { borderBottomColor: 'rgba(0, 0, 0, 0.1)' }]}>
                            <View style={[styles.optionIcon, { backgroundColor: 'rgba(44, 95, 93, 0.1)' }]}>
                              <Ionicons name="trending-up" size={18} color="#2C5F5D" />
                            </View>
                            <Text style={[styles.optionText, { color: '#2C5F5D' }]}>Growth</Text>
                            <Ionicons name="chevron-forward" size={16} color="#999999" />
                          </TouchableOpacity>
                          
                          <TouchableOpacity style={[styles.optionItem, { borderBottomWidth: 0 }]}>
                            <View style={[styles.optionIcon, { backgroundColor: 'rgba(255, 68, 68, 0.1)' }]}>
                              <Ionicons name="log-out" size={18} color="#FF4444" />
                            </View>
                            <Text style={[styles.optionText, { color: '#FF4444' }]}>Log Out</Text>
                            <Ionicons name="chevron-forward" size={16} color="#999999" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </>
                )}
              </View>
            )}
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
});
