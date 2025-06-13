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
import { MaterialIcons } from '@expo/vector-icons';
import { SnackStepContext } from '../context/SnackStepContext';
import { snacks } from '../data/SnackSuggestions.js';

// Categories for after workout snacks if no recent workouts
const SNACK_CATEGORIES = [
  { key: 'quick', label: 'Quick Energy', filter: s => s.calories <= 120 },
  { key: 'protein', label: 'Protein Boost', filter: s => s.description?.toLowerCase().includes('protein') },
  { key: 'lowcal', label: 'Low Calorie', filter: s => s.calories <= 80 },
  { key: 'filling', label: 'Filling', filter: s => s.calories > 150 },
];

// Helper: Get random snacks from SnackSuggestions.js by intensity
const getPreWorkoutSnacksByIntensity = (intensity) => {
  if (!intensity) return [];
  let min = 0, max = Infinity;
  if (intensity === 'Low') {
    min = 0; max = 160;
  } else if (intensity === 'Medium') {
    min = 161; max = 230;
  } else if (intensity === 'High') {
    min = 231; max = Infinity;
  }
  const filtered = snacks.filter(s => s.calories >= min && s.calories <= max);
  // Shuffle and pick 5
  return filtered
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);
};

export default function SnackSuggestionTab() {
  const { step, setStep } = useContext(SnackStepContext);

  // UI state
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedIntensity, setSelectedIntensity] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showPreModal, setShowPreModal] = useState(false);
  const [showAfterModal, setShowAfterModal] = useState(false);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [view, setView] = useState('selection'); // 'selection' | 'snackList'
  const [suggestedSnacks, setSuggestedSnacks] = useState([]);
  const [snackModalVisible, setSnackModalVisible] = useState(false);
  const [snackModalData, setSnackModalData] = useState(null);

  // Handles first step: show intensity or workout modal
  const handleFirstConfirm = () => {
    if (selectedOption === 'Pre workout') {
      setSelectedIntensity(null); // Reset intensity each time modal opens
      setShowPreModal(true);
    } else if (selectedOption === 'After workout') {
      fetchRecentWorkouts();
      setShowAfterModal(true);
    }
  };

  // Loads recent workouts from storage
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

  // Suggest snacks based on user selection
  const handleShowSnacks = () => {
    let suggested = [];

    if (selectedOption === 'After workout') {
      if (selectedWorkout) {
        // Suggest snacks based on calories burned in workout
        let filteredSnacks;
        if (selectedWorkout.caloriesBurned > 400) {
          filteredSnacks = snacks.filter(s => s.calories > 200);
        } else {
          filteredSnacks = snacks.filter(s => s.calories <= 200);
        }
        // Shuffle and pick 5
        suggested = filteredSnacks
          .slice()
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
      } 
      // No workouts: show one random snack per category
      else if (recentWorkouts.length === 0) {
        suggested = SNACK_CATEGORIES.map(cat => {
          const filtered = snacks.filter(cat.filter);
          if (!filtered.length) return null;
          return {
            ...filtered[Math.floor(Math.random() * filtered.length)],
            _category: cat.label,
          };
        }).filter(Boolean); // Remove nulls
      }
    } else if (selectedOption === 'Pre workout' && selectedIntensity) {
      suggested = getPreWorkoutSnacksByIntensity(selectedIntensity);
    }

    setSuggestedSnacks(suggested);
    setShowPreModal(false);
    setShowAfterModal(false);
    setView('snackList');
  };

  // Reset to selection screen
  const handleBack = () => {
    setSelectedOption(null);
    setSelectedIntensity(null);
    setSelectedWorkout(null);
    setSuggestedSnacks([]);
    setView('selection');
    setStep(1);
  };

  // Open/close snack details modal
  const openSnackModal = (snack) => {
    setSnackModalData(snack);
    setSnackModalVisible(true);
  };
  const closeSnackModal = () => {
    setSnackModalVisible(false);
    setSnackModalData(null);
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
        {/* Back arrow at top left */}
        <Pressable
          style={styles.backArrow}
          onPress={handleBack}
        >
          <MaterialIcons name="arrow-back" size={28} color="#222" />
        </Pressable>
        <Text style={[styles.title, { marginTop: 40 }]}>{snackListTitle}</Text>
        {snackListDescription ? (
          <Text style={styles.subtitle}>{snackListDescription}</Text>
        ) : null}
        <ScrollView>
          {suggestedSnacks.map((snack, index) => (
            <Pressable
              key={index}
              style={styles.snackCard}
              onPress={() => openSnackModal(snack)}
            >
              <Text style={styles.snackEmoji}>{snack.emoji}</Text>
              <View style={styles.snackContent}>
                <Text style={styles.snackTitle}>{snack.name}</Text>
                <Text style={styles.snackDetails}>{snack.calories} kcal</Text>
                <Text style={styles.snackDescription}>{snack.description}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Snack Details Modal */}
        <Modal visible={snackModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {snackModalData?.emoji} {snackModalData?.name}
              </Text>
              <Text style={styles.snackDetails}>
                {snackModalData?.calories} kcal
              </Text>
              <Text style={styles.snackDescription}>
                {snackModalData?.description}
              </Text>
              {/* Show extra details for both Pre and After workout */}
              {snackModalData?.details && (
                <View style={{ marginTop: 16 }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Why it's good:</Text>
                  <Text style={{ marginBottom: 8 }}>{snackModalData.details.whyGood}</Text>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Serving suggestion:</Text>
                  <Text style={{ marginBottom: 8 }}>{snackModalData.details.servingSuggestion}</Text>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Allergen alert:</Text>
                  <Text style={{ marginBottom: 8 }}>{snackModalData.details.allergenAlert}</Text>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Dietary suitability:</Text>
                  <Text style={{ marginBottom: 8 }}>{snackModalData.details.dietarySuitability}</Text>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Key vitamins:</Text>
                  <Text>{snackModalData.details.keyVitamins}</Text>
                </View>
              )}
              <View style={styles.modalActions}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={closeSnackModal}
                >
                  <Text style={styles.confirmButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
        <Text style={[styles.subtitle, { fontWeight: 'bold' }]}>Select a snack for:</Text>

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
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setShowPreModal(false);
                  setSelectedIntensity(null); // Reset intensity on cancel
                }}
              >
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.confirmButton,
                  { marginLeft: 10 },
                  !selectedIntensity && styles.confirmButtonDisabled
                ]}
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
            <Text style={styles.modalTitle}>
              {recentWorkouts.length === 0
                ? 'No recent workouts found'
                : 'Select one of your last 3 workouts'}
            </Text>
            {recentWorkouts.length === 0 ? (
              <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 18, fontSize: 15 }]}>
                Save a workout through the Calories tab or see random suggestions
              </Text>
            ) : (
              recentWorkouts.map((workout, index) => (
                <Pressable
                  key={index}
                  style={styles.workoutItem}
                  onPress={() => setSelectedWorkout(workout)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.workoutText}>{workout.emoji} {workout.type}</Text>
                    <Text style={styles.workoutDetails}>
                      Duration: {workout.duration} mins | 🔥 {workout.caloriesBurned} kcal
                    </Text>
                    <Text style={styles.workoutDate}>🕒 {new Date(workout.date).toLocaleString()}</Text>
                  </View>
                  <View style={styles.circleWrapper}>
                    {selectedWorkout?.id === workout.id ? (
                      <View style={styles.circleSelected}>
                        <Text style={styles.tick}>✓</Text>
                      </View>
                    ) : (
                      <View style={styles.circleUnselected} />
                    )}
                  </View>
                </Pressable>
              ))
            )}

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setShowAfterModal(false)}>
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.confirmButton,
                  { marginLeft: 10 },
                  (recentWorkouts.length !== 0 && !selectedWorkout) && styles.confirmButtonDisabled
                ]}
                onPress={handleShowSnacks}
                disabled={recentWorkouts.length !== 0 && !selectedWorkout}
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
    marginBottom: 15,
  },
  radioButtonOuter: {
    height: 22,
    width: 22,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
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
  
  confirmButtonDisabled: {
    backgroundColor: 'gray',
  },
  
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 2,
  },
  circleUnselected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#555',
    backgroundColor: '#fff',
  },
  circleSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'green',
    backgroundColor: '#e6f4ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tick: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
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
  backArrow: {
    position: 'absolute',
    top: 18,
    left: 10,
    zIndex: 10,
    padding: 8,
  },
});