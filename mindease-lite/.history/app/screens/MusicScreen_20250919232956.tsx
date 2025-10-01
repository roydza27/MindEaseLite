import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Music'>;

export default function MusicScreen({ navigation }: Props) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);


  const playSound = async () => {
  const { sound } = await Audio.Sound.createAsync(require('../../assets/music/music1.mp3'));
    setSound(sound);
    await sound.playAsync();
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
