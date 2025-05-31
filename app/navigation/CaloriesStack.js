import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import WorkoutTypeScreen from '../screens/WorkoutTypeScreen';

const Stack = createStackNavigator();

export default function CaloriesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SweatBite' }} />
      <Stack.Screen name="WorkoutType" component={WorkoutTypeScreen} options={{ title: 'Select Workout' }} />
    </Stack.Navigator>
  );
}
