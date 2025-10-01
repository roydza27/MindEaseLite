import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ActivityScreen from '../screens/ActivityScreen';
import GoalScreen from '../screens/GoalScreen';
import MoodScreen from '../screens/MoodScreen';
import MusicScreen from '../screens/MusicScreen';

export type RootStackParamList = {
  Mood: undefined;
  Activities: undefined;
  Music: undefined;
  Goals: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Mood" component={MoodScreen} />
      <Stack.Screen name="Activities" component={ActivityScreen} />
      <Stack.Screen name="Music" component={MusicScreen} />
      <Stack.Screen name="Goals" component={GoalScreen} />
    </Stack.Navigator>
  );
}
