import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';

export default function HomeScreen() {
  const [duration, setDuration] = useState(15);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculation of calories</Text>
      <Text style={styles.subtitle}>
        Estimate how many calories you burned during your workout.
      </Text>

      {/* Workout Selection Button */}
      <Pressable
        style={styles.workoutBox}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // vibration on open modal
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

      {/* Duration Slider */}
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
          <Text style={styles.sliderEdgeLabel}>15 min</Text>
          <Slider
            style={styles.slider}
            minimumValue={15}
            maximumValue={120}
            step={1}
            value={duration}
            onValueChange={(val) => {
              setDuration(Math.round(val));
              Haptics.selectionAsync(); // vibration on slider change
            }}
            minimumTrackTintColor="tomato"
            maximumTrackTintColor="#ccc"
            thumbTintColor="tomato"
          />
          <Text style={styles.sliderEdgeLabel}>120 min</Text>
        </View>
      </View>

      {/* Modal for workout options */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.fullWidthModal}>
            <Text style={styles.modalTitle}>Select Workout</Text>

            <ScrollView style={{ maxHeight: '85%', marginBottom: 10 }}>
              {workoutData.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => {
                    setSelectedWorkout(item);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // vibration on selection
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
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // vibration on cancel
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  arrow: {
    fontSize: 22,
    color: '#555',
    fontWeight: 'bold',
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
    textAlign: 'left',
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
  modalCancel: {
    marginTop: 15,
    textAlign: 'center',
    color: 'tomato',
    fontWeight: 'bold',
  },
});
