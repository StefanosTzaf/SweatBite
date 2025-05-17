import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export default function Layout() {
  return (
    <>
      {/* Κοινό header πάνω από τα tabs */}
      <View style={{ paddingTop: 50, paddingBottom: 10, backgroundColor: 'tomato' }}>
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          SweatBite
        </Text>
      </View>

      {/* Τα Tabs */}
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
        <Tabs.Screen name="index" options={{ title: 'Burn' }} />
        <Tabs.Screen name="nutrition" options={{ title: 'Food' }} />
        <Tabs.Screen name="achievements" options={{ title: 'Goals' }} />
      </Tabs>
    </>
  );
}
