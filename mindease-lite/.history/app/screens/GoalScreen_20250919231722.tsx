
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GoalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold' },
});
