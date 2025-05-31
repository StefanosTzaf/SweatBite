import React, { useState } from 'react';
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
    { name: 'Cycling', emoji: '🚴' },
    { name: 'Dancing', emoji: '💃' },
    { name: 'Hiking', emoji: '🥾' },
    { name: 'Home Workouts', emoji: '🏠' },
    { name: 'Jogging', emoji: '🏃‍♂️' },
    { name: 'Lifting Weights', emoji: '🏋️' },
    { name: 'Martial arts', emoji: '🥋' },
    { name: 'Running', emoji: '🏃' },
    { name: 'Swimming', emoji: '🏊' },
    { name: 'Team Sports', emoji: '🏀' },
    { name: 'Walking', emoji: '🚶' },
    { name: 'Yoga-Pilates', emoji: '🧘' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculation of calories</Text>
      <Text style={styles.subtitle}>
        Estimate how many calories you burned during your workout.
      </Text>

      {/* Workout Selection Button */}
      <Pressable style={styles.workoutBox} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>
          {selectedWorkout
            ? `${selectedWorkout.emoji} ${selectedWorkout.name}`
            : '💪 Workout Type'}
        </Text>
        <Text style={styles.arrow}>{`>`}</Text>

      </Pressable>

      {/* Duration Slider */}
      <View style={styles.sliderBox}>
        <Text style={styles.label}>⏱ Duration</Text>
        <Text style={styles.note}>Calories are calculated based on duration</Text>

        <Text style={styles.durationText}>{duration} minutes</Text>

        <View style={styles.sliderWrapper}>
          <Text style={styles.sliderEdgeLabel}>15 min</Text>
          <Slider
            style={styles.slider}
            minimumValue={15}
            maximumValue={120}
            step={1}
            value={duration}
            onValueChange={(val) => setDuration(Math.round(val))}
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

            <Pressable onPress={() => setModalVisible(false)}>
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
    fontSize: 22,
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
    backgroundColor: '#fafafa',
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
