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
        {activeTab === 'mood-tracker' && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFE4E1' }}>
            <Text style={{ fontSize: 32, color: '#FF69B4', fontWeight: 'bold' }}>❤️ Mood Tracker</Text>
            <Text style={{ fontSize: 18, color: '#FF1493', marginTop: 10 }}>Coming Soon!</Text>
            <Text style={{ fontSize: 14, color: '#666666', marginTop: 20, textAlign: 'center' }}>
              Track your daily mood and emotional well-being
            </Text>
          </View>
        )}
        {activeTab === 'activity' && <Activity onNavigate={handleNavigate} />}
        {activeTab === 'settings' && <Settings onNavigate={handleNavigate} />}
        
      </View>
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      
      {/* Debug overlay */}
      <View style={{ position: 'absolute', top: 50, left: 10, backgroundColor: 'rgba(0,0,0,0.8)', padding: 8, borderRadius: 4 }}>
        <Text style={{ color: 'white', fontSize: 10 }}>Active: {activeTab}</Text>
      </View>
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
