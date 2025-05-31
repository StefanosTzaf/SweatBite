import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Slider,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation, route }) {
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [duration, setDuration] = useState(30);

  React.useEffect(() => {
    if (route.params?.workout) {
      setSelectedWorkout(route.params.workout);
    }
  }, [route.params?.workout]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculation of calories</Text>
      <Text style={styles.subtitle}>Estimate how many calories you burned during your workout.</Text>

      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate('WorkoutType')}
      >
        <Text style={styles.cardText}>
          {selectedWorkout || 'Workout Type'}
        </Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#333" />
      </Pressable>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Duration: {duration} minutes</Text>
        <Slider
          style={{ width: '100%' }}
          minimumValue={15}
          maximumValue={120}
          step={5}
          value={duration}
          onValueChange={setDuration}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#ddd"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#E7FBE7',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sliderContainer: {
    marginTop: 10,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
});
