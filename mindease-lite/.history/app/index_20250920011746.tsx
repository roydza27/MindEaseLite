import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SplashScreen from '../components/SplashScreen';

export default function HomeScreen() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to MindEase Lite!</Text>
      <Text style={styles.subtext}>Your mental wellness companion</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C5F5D',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#4A7C7A',
    textAlign: 'center',
  },
});
