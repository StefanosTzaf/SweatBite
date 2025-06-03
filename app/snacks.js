import { useContext, useState, useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SnackStepContext } from '../context/SnackStepContext';
import { snacks } from '../data/SnackSuggestions.js'; 

export default function SnackSuggestionTab() {
  const { step, setStep } = useContext(SnackStepContext);

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedIntensity, setSelectedIntensity] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showPreModal, setShowPreModal] = useState(false);
  const [showAfterModal, setShowAfterModal] = useState(false);
  const [recentWorkouts, setRecentWorkouts] = useState([]);

  const handleFirstConfirm = () => {
    if (selectedOption === 'Pre workout') {
      setShowPreModal(true);
    } else if (selectedOption === 'After workout') {
      fetchRecentWorkouts();
      setShowAfterModal(true);
    }
  };

  const fetchRecentWorkouts = async () => {
    try {
      const stored = await AsyncStorage.getItem('workouts');
      const parsed = stored ? JSON.parse(stored) : [];
      setRecentWorkouts(parsed.reverse().slice(0, 3));
    } catch (err) {
      Alert.alert('Error', 'Failed to load workouts');
      console.error(err);
    }
  };

  const getPreWorkoutSnacksByIntensity = (intensity) => {
    if (!intensity) return [];

    if (intensity === 'Low') {
      return snacks.filter(s => s.calories <= 150).slice(0, 5);
    } else if (intensity === 'Medium') {
      return snacks.filter(s => s.calories > 150 && s.calories <= 220).slice(0, 5);
    } else if (intensity === 'High') {
      return snacks.filter(s => s.calories > 220).slice(0, 5);
    }

    return [];
  };

  const handleShowSnacks = () => {
    let message = '';

    if (selectedOption === 'After workout' && selectedWorkout) {
      message = `After workout: ${selectedWorkout.type} | 🔥 ${selectedWorkout.caloriesBurned} kcal`;
      // μπορείς να προσθέσεις αντίστοιχο φίλτρο εδώ
    } else if (selectedOption === 'Pre workout' && selectedIntensity) {
      const suggested = getPreWorkoutSnacksByIntensity(selectedIntensity);
      message = `Pre workout | Intensity: ${selectedIntensity}\n\nSuggested Snacks:\n` +
        suggested.map(s => `${s.emoji} ${s.name} - ${s.calories} kcal`).join('\n');
    }

    Alert.alert('Snack Suggestions', message);

    setShowPreModal(false);
    setShowAfterModal(false);
    setStep(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snack suggestion</Text>

      <View style={styles.optionGroupCard}>
        <Text style={styles.subtitle}>Select a snack for:</Text>

        <Pressable style={styles.radioButtonContainer} onPress={() => setSelectedOption('Pre workout')}>
          <View style={styles.radioButtonOuter}>
            {selectedOption === 'Pre workout' && <View style={styles.radioButtonInner} />}
          </View>
          <View>
            <Text style={styles.radioLabel}>Pre workout</Text>
            <Text style={styles.description}>Light energy boost before training</Text>
          </View>
        </Pressable>

        <Pressable style={styles.radioButtonContainer} onPress={() => setSelectedOption('After workout')}>
          <View style={styles.radioButtonOuter}>
            {selectedOption === 'After workout' && <View style={styles.radioButtonInner} />}
          </View>
          <View>
            <Text style={styles.radioLabel}>After workout</Text>
            <Text style={styles.description}>Aid muscle recovery and refuel</Text>
          </View>
        </Pressable>
      </View>

      {selectedOption && (
        <Pressable style={styles.confirmButton} onPress={handleFirstConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </Pressable>
      )}

      {/* Pre-workout Intensity Modal */}
      <Modal visible={showPreModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select an intensity for your workout</Text>
            {[
              { label: 'Low', desc: 'Light movement (yoga, walking)' },
              { label: 'Medium', desc: 'Steady workout (weights, cycling)' },
              { label: 'High', desc: 'Intense effort (sprinting)' },
            ].map(item => (
              <Pressable
                key={item.label}
                style={styles.radioButtonContainer}
                onPress={() => setSelectedIntensity(item.label)}
              >
                <View style={styles.radioButtonOuter}>
                  {selectedIntensity === item.label && <View style={styles.radioButtonInner} />}
                </View>
                <View>
                  <Text style={styles.radioLabel}>{item.label}</Text>
                  <Text style={styles.description}>{item.desc}</Text>
                </View>
              </Pressable>
            ))}

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setShowPreModal(false)}>
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmButton, { marginLeft: 10 }]}
                onPress={handleShowSnacks}
                disabled={!selectedIntensity}
              >
                <Text style={styles.confirmButtonText}>Show Snacks</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* After Workout Modal */}
      <Modal visible={showAfterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select one of your last 3 workouts</Text>
            {recentWorkouts.length === 0 ? (
              <Text>No recent workouts found.</Text>
            ) : (
              recentWorkouts.map((workout, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.workoutItem,
                    selectedWorkout?.id === workout.id && styles.workoutItemSelected,
                  ]}
                  onPress={() => setSelectedWorkout(workout)}
                >
                  <Text style={styles.workoutText}>{workout.emoji} {workout.type}</Text>
                  <Text style={styles.workoutDetails}>
                    Duration: {workout.duration} mins | 🔥 {workout.caloriesBurned} kcal
                  </Text>
                  <Text style={styles.workoutDate}>🕒 {new Date(workout.date).toLocaleString()}</Text>
                </Pressable>
              ))
            )}

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setShowAfterModal(false)}>
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmButton, { marginLeft: 10 }]}
                onPress={handleShowSnacks}
                disabled={!selectedWorkout}
              >
                <Text style={styles.confirmButtonText}>Show Snacks</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fdfdfd' },
  title: { fontWeight: 'bold', fontSize: 24, marginBottom: 40, color: 'black' },
  subtitle: { fontSize: 18, marginBottom: 40, color: '#555' },

  optionGroupCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#e6f4ea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },

  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  radioButtonOuter: {
    height: 22,
    width: 22,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginTop: 4,
  },
  radioButtonInner: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: 'black',
  },
  radioLabel: { fontSize: 17, fontWeight: '600' },
  description: { fontSize: 14, color: '#888', marginTop: 4 },

  confirmButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'green',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: 20,
  },
  cancelButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'gray',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: 20,
  },
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },

  workoutItem: {
    backgroundColor: '#e6f4ea',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  workoutItemSelected: {
    borderColor: 'green',
    borderWidth: 2,
  },
  workoutText: {
    fontSize: 18,
    fontWeight: '600',
  },
  workoutDetails: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  workoutDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
