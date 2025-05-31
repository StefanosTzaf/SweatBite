// app/_layout.js
import React from 'react';
import { useRouter } from 'expo-router';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SweatBite</Text>
      </View>


      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
          },
          tabBarIcon: ({ focused, size }) => {
            let emoji = '';
            let fontSize = size;

            if (route.name === 'index') {
              emoji = '🔥';
              fontSize = size * 0.85;
            } else if (route.name === 'snacks') {
              emoji = '🍎';
              fontSize = size * 0.85;
            } else if (route.name === 'goals') {
              emoji = '🏆';
            }

            return (
              <Text
                style={{
                  fontSize,
                  opacity: focused ? 1 : 0.3,
                }}
              >
                {emoji}
              </Text>
            );
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Calories' }} />
        <Tabs.Screen name="snacks" options={{ title: 'Snacks' }} />
        <Tabs.Screen name="goals" options={{ title: 'Goals' }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50, // Για να κατέβει κάτω από το status bar
    paddingBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'tomato',
  },
});
