import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CaloriesStack from './CaloriesStack';
import SnacksScreen from '../screens/SnacksScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Calories') {
            return <Ionicons name="flame" size={size} color={color} />;
          } else if (route.name === 'Snacks') {
            return <FontAwesome5 name="apple-alt" size={size} color={color} />;
          } else {
            return <FontAwesome5 name="trophy" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Calories" component={CaloriesStack} />
      <Tab.Screen name="Snacks" component={SnacksScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
    </Tab.Navigator>
  );
}
