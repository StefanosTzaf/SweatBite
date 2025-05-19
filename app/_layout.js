import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function Layout() {
  return (
    <>
      {/* iOS-style header using SafeAreaView */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Ionicons name="flame" size={24} color="tomato" style={styles.icon} />
          <Text style={styles.title}>SweatBite</Text>
        </View>
      </SafeAreaView>

      {/* iOS Tab Navigator */}
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
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#eee',
            paddingBottom: 6,
            height: 60,
          },
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
  safeArea: {
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
