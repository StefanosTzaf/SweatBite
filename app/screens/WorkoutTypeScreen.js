import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const workoutTypes = [
  { label: 'Running', icon: <MaterialCommunityIcons name="run" size={24} color="#333" /> },
  { label: 'Walking', icon: <MaterialCommunityIcons name="walk" size={24} color="#333" /> },
  { label: 'Cycling', icon: <MaterialCommunityIcons name="bike" size={24} color="#333" /> },
  { label: 'Football Training', icon: <FontAwesome5 name="futbol" size={22} color="#333" /> },
  { label: 'Lift Weights', icon: <FontAwesome5 name="dumbbell" size={22} color="#333" /> },
  { label: 'Yoga', icon: <MaterialCommunityIcons name="yoga" size={24} color="#333" /> },
  { label: 'Swimming', icon: <MaterialCommunityIcons name="swim" size={24} color="#333" /> },
];

export default function WorkoutTypeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Workout Type:</Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        {workoutTypes.map((workout, index) => (
          <Pressable
            key={index}
            onPress={() => navigation.navigate('Home', { workout: workout.label })}
            style={styles.card}
          >
            <View style={styles.icon}>{workout.icon}</View>
            <Text style={styles.label}>{workout.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  scroll: { paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7FBE7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cceccc',
  },
  icon: { marginRight: 12 },
  label: { fontSize: 16, fontWeight: '500', color: '#333' },
});
