
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return <View style={styles.whiteScreen} />;
}

const styles = StyleSheet.create({
  whiteScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
