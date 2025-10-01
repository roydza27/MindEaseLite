

import React, { useState } from 'react';
import IntroVideoScreen from './IntroVideoScreen';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const [showVideo, setShowVideo] = useState(true);
  const router = useRouter();

  if (showVideo) {
    return <IntroVideoScreen />;
  }
  // After video, show main app (index.tsx)
  router.replace('/');
  return <View style={styles.whiteScreen} />;
}

const styles = StyleSheet.create({
  whiteScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
