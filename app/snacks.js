import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
  const [view, setView] = useState('selection'); // 'selection' | 'snackList'
  const [suggestedSnacks, setSuggestedSnacks] = useState([]);

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
    let suggested = [];

    if (selectedOption === 'After workout' && selectedWorkout) {
      // Basic filter: more calories burned = higher-calorie snacks
      if (selectedWorkout.caloriesBurned > 400) {
        suggested = snacks.filter(s => s.calories > 200).slice(0, 5);
      } else {
        suggested = snacks.filter(s => s.calories <= 200).slice(0, 5);
      }
    } else if (selectedOption === 'Pre workout' && selectedIntensity) {
      suggested = getPreWorkoutSnacksByIntensity(selectedIntensity);
    }

    setSuggestedSnacks(suggested);
    setShowPreModal(false);
    setShowAfterModal(false);
    setView('snackList');
  };

  const handleBack = () => {
    setSelectedOption(null);
    setSelectedIntensity(null);
    setSelectedWorkout(null);
    setSuggestedSnacks([]);
    setView('selection');
    setStep(1);
  };

  // -----------------
  // Snack List View (Pre or After workout)
  // -----------------
  if (view === 'snackList') {
    // Determine if it's pre or after workout
    const isPre = selectedOption === 'Pre workout';

    // For pre-workout: show intensity
    // For after-workout: show workout summary
    let snackListTitle = isPre ? 'Pre-workout snacks' : 'After-workout snacks';
    let snackListDescription = '';
    if (isPre) {
      snackListDescription = selectedIntensity
        ? `${selectedIntensity} intensity`
        : '';
    } else if (selectedWorkout) {
      snackListDescription = `${selectedWorkout.emoji} ${selectedWorkout.type} — ${selectedWorkout.duration} min, 🔥 ${selectedWorkout.caloriesBurned} kcal`;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{snackListTitle}</Text>
        {snackListDescription ? (
          <Text style={styles.subtitle}>{snackListDescription}</Text>
        ) : null}
        <ScrollView>
          {suggestedSnacks.map((snack, index) => (
            <View key={index} style={styles.snackCard}>
              <Text style={styles.snackEmoji}>{snack.emoji}</Text>
              <View style={styles.snackContent}>
                <Text style={styles.snackTitle}>{snack.name}</Text>
                <Text style={styles.snackDetails}>{snack.calories} kcal</Text>
                <Text style={styles.snackDescription}>{snack.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <Pressable style={styles.confirmButton} onPress={handleBack}>
          <Text style={styles.confirmButtonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  // -----------------
  // Default Selection Screen
  // -----------------
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
  title: { fontWeight: 'bold', fontSize: 24, marginBottom: 30, color: 'black' },
  subtitle: { fontSize: 18, marginBottom: 40, color: '#555' },

  optionGroupCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#e6f4ea',
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
    marginTop: 20,
  },
  cancelButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'gray',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 30,
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

  snackCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: '#cfcfcf',
    borderWidth: 1,
    elevation: 2,
  },
  snackEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  snackContent: {
    flex: 1,
  },
  snackTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  snackDetails: {
    fontSize: 14,
    color: 'tomato',
    marginBottom: 6,
  },
  snackDescription: {
    fontSize: 13,
    color: '#666',
  },
});
