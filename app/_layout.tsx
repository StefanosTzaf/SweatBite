import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <>
      {/* Custom header με εικονίδιο + όνομα */}
      <View style={styles.header}>
        <Ionicons name="flame" size={24} color="tomato" style={styles.icon} />
        <Text style={styles.title}>SweatBite</Text>
      </View>

      {/* Tab Navigator */}
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'index') {
              return <Ionicons name="flame" size={size} color={color} />;
            } else if (route.name === 'nutrition') {
              return <FontAwesome5 name="apple-alt" size={size} color={color} />;
            } else if (route.name === 'achievements') {
              return <FontAwesome5 name="trophy" size={size} color={color} />;
            } else {
              return <Ionicons name="help" size={size} color={color} />;
            }
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Calories', headerShown: false }} />
        <Tabs.Screen name="nutrition" options={{ title: 'Snacks', headerShown: false }} />
        <Tabs.Screen name="achievements" options={{ title: 'Achievements', headerShown: false }} />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'tomato',
  },
});
