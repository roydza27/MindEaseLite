import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Linking, ScrollView, StyleSheet, Text } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Activities'>;

export default function ActivityScreen({ navigation }: Props) {
  const activities = [
    { name: 'Meditation Guide', url: 'https://www.youtube.com/watch?v=inpok4MKVLM' },
    { name: 'Yoga for Relaxation', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE' },
    { name: 'Motivational Video', url: 'https://www.youtube.com/watch?v=mgmVOuLgFB0' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Activity Suggestions</Text>
      {activities.map((item, index) => (
        <Button key={index} title={item.name} onPress={() => Linking.openURL(item.url)} />
      ))}
      <Button title="Next: Music" onPress={() => navigation.navigate('Music')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, marginBottom: 20 },
});
