
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
  return <View style={styles.whiteScreen} />;
}

const styles = StyleSheet.create({
  whiteScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
