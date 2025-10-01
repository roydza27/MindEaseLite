import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Activity from '../components/Activity';
import BlockKit from '../components/BlockKit';
import BottomNavigation from '../components/BottomNavigation';
import Dashboard from '../components/Dashboard';
import Profile from '../components/Profile';
import SplashScreen from '../components/SplashScreen';

export default function HomeScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  
  console.log('HomeScreen rendering, activeTab:', activeTab, 'showSplash:', showSplash);

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
        {activeTab === 'profile' && <Profile onNavigate={handleNavigate} />}
        {activeTab === 'settings' && <View><Text>Settings Page</Text></View>}
        {/* Debug info */}
        <View style={{ position: 'absolute', top: 100, left: 10, backgroundColor: 'rgba(0,0,0,0.8)', padding: 10, borderRadius: 5 }}>
          <Text style={{ color: 'white', fontSize: 12 }}>Active Tab: {activeTab}</Text>
          <Text style={{ color: 'white', fontSize: 12 }}>Show Splash: {showSplash ? 'Yes' : 'No'}</Text>
          <Text style={{ color: 'white', fontSize: 12 }}>Activity Tab Check: {activeTab === 'activity' ? 'TRUE' : 'FALSE'}</Text>
        </View>
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
