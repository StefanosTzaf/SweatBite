import { Tabs, useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SnackStepContext, SnackStepProvider } from '../context/SnackStepContext';
import { GoalsProvider } from '../context/GoalsContext';

function LayoutContent() {
  const router = useRouter();
  const { step, setStep } = useContext(SnackStepContext);

  return (
    <View style={styles.container}>
      {/* Header section with title and back button */}
      <View style={styles.header}>
        {step === 2 && (
          <Pressable
            onPress={() => setStep(1)} // Navigate back to step 1
            style={styles.backButton}
            android_ripple={{ color: '#ccc', borderless: true }}
          >
            <Ionicons name="arrow-back" size={28} color="black" />
          </Pressable>
        )}

        <Text style={styles.title}>SweatBite</Text>
      </View>

      {/* Tab navigation with custom icons */}
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false, // Hide default header
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

            // Assign emoji based on route name
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
                  opacity: focused ? 1 : 0.3, // Adjust opacity based on focus
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
        {/* Define screens for the tabs */}
        <Tabs.Screen name="index" options={{ title: 'Calories' }} />
        <Tabs.Screen name="snacks" options={{ title: 'Snacks' }} />
        <Tabs.Screen name="goals" options={{ title: 'Goals' }} />
      </Tabs>
    </View>
  );
}

{/* Provide context for goals and snack steps */}
export default function Layout() {
  return (
      <GoalsProvider>
        <SnackStepProvider>
          <LayoutContent />
        </SnackStepProvider>
      </GoalsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    padding: 4,
    top: 50,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'tomato',
  },
});