import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import BlockKit from '../components/BlockKit';
import BottomNavigation from '../components/BottomNavigation';
import Dashboard from '../components/Dashboard';
import Profile from '../components/Profile';
import SplashScreen from '../components/SplashScreen';

export default function HomeScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleTabPress = (tab: string) => {
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
        {activeTab === 'profile' && <Profile onNavigate={handleNavigate} />}
        {/* Add other tab content here */}
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
