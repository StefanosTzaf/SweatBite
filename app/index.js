import React, { useState, useContext } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoalsContext } from '../context/GoalsContext';

export default function HomeScreen() {
  const [duration, setDuration] = useState(15);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const { goals, updateGoalProgress } = useContext(GoalsContext);

  const workoutData = [
    { name: 'Cycling', emoji: '🚴', caloriesPerMinute: 8 },
    { name: 'Dancing', emoji: '💃', caloriesPerMinute: 6 },
    { name: 'Hiking', emoji: '🥾', caloriesPerMinute: 7 },
    { name: 'Home Workouts', emoji: '🏠', caloriesPerMinute: 5 },
    { name: 'Jogging', emoji: '🏃‍♂️', caloriesPerMinute: 10 },
    { name: 'Lifting Weights', emoji: '🏋️', caloriesPerMinute: 6 },
    { name: 'Martial arts', emoji: '🥋', caloriesPerMinute: 9 },
    { name: 'Running', emoji: '🏃', caloriesPerMinute: 12 },
    { name: 'Swimming', emoji: '🏊', caloriesPerMinute: 11 },
    { name: 'Team Sports', emoji: '🏀', caloriesPerMinute: 9 },
    { name: 'Walking', emoji: '🚶', caloriesPerMinute: 4 },
    { name: 'Yoga-Pilates', emoji: '🧘', caloriesPerMinute: 3 },
  ];

  const caloriesBurned = selectedWorkout
    ? selectedWorkout.caloriesPerMinute * duration
    : 0;

  const handleSaveWorkout = async () => {
    if (!selectedWorkout) {
      Alert.alert('Select workout', 'Please select a workout type first.');
      return;
    }

    try {
      const stored = await AsyncStorage.getItem('workouts');
      const workouts = stored ? JSON.parse(stored) : [];

      const newWorkout = {
        id: Date.now(),
        type: selectedWorkout.name,
        emoji: selectedWorkout.emoji,
        duration,
        caloriesBurned,
        date: new Date().toISOString(),
      };

      workouts.push(newWorkout);
      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));

      await updateGoalProgress('Calories burned', undefined, caloriesBurned);
      await updateGoalProgress('Number of workouts per week', undefined, 1);

      Alert.alert('Saved', 'Your workout was saved successfully!');
      setSelectedWorkout(null);
      setDuration(15);
    } catch (error) {
      Alert.alert('Error', 'Failed to save workout.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculation of calories</Text>
      <Text style={styles.subtitle}>
        Estimate how many calories you burned during your workout.
      </Text>

      <Pressable
        style={styles.workoutBox}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>
          {selectedWorkout
            ? `${selectedWorkout.emoji} ${selectedWorkout.name}`
            : '💪 Workout Type'}
        </Text>
        <MaterialIcons name="chevron-right" size={24} color="#555" />
      </Pressable>

      <View style={styles.sliderBox}>
        <Text style={styles.label}>⏱ Duration</Text>
        <Text style={styles.note}>
          Calories are calculated based on duration
        </Text>

        <Text style={styles.durationText}>{duration} minutes</Text>

        {selectedWorkout && (
          <Text style={styles.caloriesText}>
            🔥 Estimated calories burned: {caloriesBurned} kcal
          </Text>
        )}

        <View style={styles.sliderWrapper}>
          <Text style={styles.sliderEdgeLabel}>5 min</Text>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={180}
            step={5}
            value={duration}
            onValueChange={(val) => {
              setDuration(Math.round(val));
            }}
            minimumTrackTintColor="tomato"
            maximumTrackTintColor="#ccc"
            thumbTintColor="tomato"
            
          />
          <Text style={styles.sliderEdgeLabel}>180 min</Text>
        </View>
      </View>

      <Pressable
        style={[
          styles.saveButton,
          !(selectedWorkout && duration) && styles.saveButtonDisabled,
        ]}
        disabled={!(selectedWorkout && duration)}
        onPress={handleSaveWorkout}
      >
        <Text style={styles.saveButtonText}>Save Your Workout</Text>
      </Pressable>

      <Text style={styles.saveNote}>
        for personalized snacks and more accurate goals
      </Text>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.fullWidthModal}>
            <Text style={styles.modalTitle}>Select workout type</Text>

            <ScrollView style={{ maxHeight: '85%', marginBottom: 10 }}>
              {workoutData.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => {
                    setSelectedWorkout(item);
                    setModalVisible(false);
                  }}
                  style={styles.modalWorkoutBox}
                >
                  <Text style={styles.buttonText}>
                    {item.emoji} {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Pressable
              style={styles.modalCancelButton}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Plain snack message at bottom */}
      {selectedWorkout && (
        <Text style={styles.snackMessage}>
          Want to refuel?{' '}
          <Text style={styles.snackLink}>Check the Snacks tab</Text> for healthy options.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fdfdfd',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    color: '#555',
  },
  workoutBox: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#e6f4ea',
    marginBottom: 10,
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  sliderBox: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#e6f4ea',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  durationText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  caloriesText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'tomato',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderEdgeLabel: {
    width: 50,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: 'tomato',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  saveNote: {
    marginTop: 8,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  fullWidthModal: {
    width: '100%',
    height: '90%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalWorkoutBox: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#e6f4ea',
    marginBottom: 15,
  },
  modalCancelButton: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#fbe9e7',
    borderRadius: 20,
  },
  modalCancel: {
    textAlign: 'center',
    color: 'tomato',
    fontWeight: 'bold',
    fontSize: 16,
  },
  snackMessage: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 14,
    color: '#2e7d32',
    textAlign: 'center',
  },
  snackLink: {
    fontWeight: '700',
    color: '#2e7d32',
  },
});