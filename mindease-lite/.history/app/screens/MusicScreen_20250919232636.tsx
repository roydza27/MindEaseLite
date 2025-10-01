import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Music'>;

export default function MusicScreen({ navigation }: Props) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);


  const playSound = async () => {
    // File relax1.mp3 does not exist, so show an alert instead
    alert('Audio file not found. Please add relax1.mp3 to assets/music.');
  };

  const pauseSound = async () => {
    if (sound) await sound.pauseAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calming Music</Text>
      <Button title="Play" onPress={playSound} />
      <Button title="Pause" onPress={pauseSound} />
      <Button title="Next: Goals" onPress={() => navigation.navigate('Goals')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
});
