import Slider from '@react-native-community/slider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Mood'>;

export default function MoodScreen({ navigation }: Props) {
  const [mood, setMood] = useState<string>('🙂');
  const [stress, setStress] = useState<number>(5);
  const [note, setNote] = useState<string>('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How's your mood today?</Text>
      <TextInput
        style={styles.input}
        placeholder="Emoji or text"
        value={mood}
        onChangeText={setMood}
      />

      <Text style={styles.title}>Stress level: {stress}</Text>
      <Slider
        style={{ width: '80%', height: 40 }}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={stress}
        onValueChange={setStress}
      />

      <TextInput
        style={styles.input}
        placeholder="Optional note"
        value={note}
        onChangeText={setNote}
      />

      <Button title="Next: Activities" onPress={() => navigation.navigate('Activities')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, marginVertical: 10 },
  input: { borderWidth: 1, padding: 8, width: '80%', marginBottom: 10, borderRadius: 5 },
});
