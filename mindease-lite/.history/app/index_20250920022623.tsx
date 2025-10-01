import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Activity from '../components/Activity';
import BlockKit from '../components/BlockKit';
import BottomNavigation from '../components/BottomNavigation';
import Dashboard from '../components/Dashboard';
import Settings from '../components/Settings';
import SplashScreen from '../components/SplashScreen';

export default function HomeScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  
  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleTabPress = (tab: string) => {
    console.log('Tab pressed:', tab);
    setActiveTab(tab);
  };

  const handleNavigate = (screen: string) => {
    console.log(`Navigate to: ${screen}`);
    // Handle navigation to different screens
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'home' && <Dashboard onNavigate={handleNavigate} />}
        {activeTab === 'blockkit' && <BlockKit onNavigate={handleNavigate} />}
        {activeTab === 'activity' && <Activity onNavigate={handleNavigate} />}
        {activeTab === 'settings' && <Settings onNavigate={handleNavigate} />}
        {activeTab === 'mood-tracker' && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
            <Text style={{ fontSize: 24, color: '#2C5F5D', fontWeight: 'bold' }}>Mood Tracker</Text>
            <Text style={{ fontSize: 16, color: '#666666', marginTop: 10 }}>Coming Soon!</Text>
          </View>
        )}
      </View>
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});
