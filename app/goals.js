import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Slider from '@react-native-community/slider';

const GOAL_TYPES = [
  {
    label: 'Calories burned',
    description: 'Set a target to hit weekly or daily',
  },
  {
    label: 'Healthy snack streak',
    description: 'Track how often you choose healthy snacks',
  },
  {
    label: 'Number of workouts per week',
    description: 'Set how many times to train weekly',
  },
];

const CALORIES_PERIODS = [
  { label: 'Daily', description: 'Resets each day at midnight' },
  { label: 'Weekly', description: 'Tracks your total across the week' },
];

export default function GoalsTab() {
  const [showSetGoal, setShowSetGoal] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedGoalType, setSelectedGoalType] = useState(null);
  const [caloriesPeriod, setCaloriesPeriod] = useState(null);
  const [caloriesTarget, setCaloriesTarget] = useState(500);
  const [snackStreak, setSnackStreak] = useState(5);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(3);

  const handleAddGoalPress = () => {
    setShowSetGoal(true);
    setStep(1);
    setSelectedGoalType(null);
    setCaloriesPeriod(null);
    setCaloriesTarget(500);
  };

  const handleGoalTypeSelect = (type) => {
    setSelectedGoalType(type);
  };

  const handleSaveGoalType = () => {
    if (!selectedGoalType) return alert('Please select a goal type');
    if (selectedGoalType === 'Calories burned') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleSaveCaloriesPeriod = () => {
    if (!caloriesPeriod) return alert('Please select daily or weekly');
    setStep(3);
  };

  const handleSaveCaloriesTarget = () => {
    alert(
      `Saved: ${selectedGoalType} - ${caloriesPeriod} - ${caloriesTarget} calories`
    );
    setShowSetGoal(false);
  };

  const handleSaveSnackStreak = () => {
    alert(`Saved: ${selectedGoalType} - ${snackStreak} days`);
    setShowSetGoal(false);
  };

  const handleSaveWorkoutsGoal = () => {
    alert(`Saved: ${selectedGoalType} - ${workoutsPerWeek} workouts/week`);
    setShowSetGoal(false);
  };

  const handleCancel = () => {
    setShowSetGoal(false);
  };

  const maxCalories = caloriesPeriod === 'Weekly' ? 10000 : 1500;

  const formatCaloriesLabel = (value) => {
    if (value >= 10000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  return (
    <View style={styles.container}>
      {!showSetGoal ? (
        <>
          <Text style={styles.title}>Goals</Text>
          <Text style={styles.subtitle}>No goals yet :</Text>
          <Text style={styles.subtitle}>Tap + to set your first goal</Text>

          <Pressable style={styles.addButton} onPress={handleAddGoalPress}>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </>
      ) : step === 1 ? (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionTitle}>Choose the type of goal you want to set</Text>
          {GOAL_TYPES.map(({ label, description }) => {
            const selected = selectedGoalType === label;
            return (
              <Pressable
                key={label}
                style={styles.radioOption}
                onPress={() => handleGoalTypeSelect(label)}
              >
                <View style={[styles.radioCircle, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioInnerCircle} />}
                </View>
                <View>
                  <Text style={styles.radioLabel}>{label}</Text>
                  <Text style={styles.radioDescription}>{description}</Text>
                </View>
              </Pressable>
            );
          })}

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, !selectedGoalType && styles.buttonDisabled]}
              disabled={!selectedGoalType}
              onPress={handleSaveGoalType}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : step === 2 && selectedGoalType === 'Calories burned' ? (
        <View style={styles.selectionContainer}>
          <Text style={styles.subSelectionTitle}>Set calories burned goal for:</Text>
          {CALORIES_PERIODS.map(({ label, description }) => {
            const selected = caloriesPeriod === label;
            return (
              <Pressable
                key={label}
                style={styles.radioOption}
                onPress={() => setCaloriesPeriod(label)}
              >
                <View style={[styles.radioCircle, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioInnerCircle} />}
                </View>
                <View>
                  <Text style={styles.radioLabel}>{label}</Text>
                  <Text style={styles.radioDescription}>{description}</Text>
                </View>
              </Pressable>
            );
          })}

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, !caloriesPeriod && styles.buttonDisabled]}
              disabled={!caloriesPeriod}
              onPress={handleSaveCaloriesPeriod}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : step === 3 && selectedGoalType === 'Calories burned' ? (
        <View style={styles.selectionContainer}>
          <Text style={styles.subSelectionTitle}>How many calories do you want to burn?</Text>
          <Text style={styles.caloriesDisplay}>{caloriesTarget} cals</Text>
          <View style={styles.sliderLabelsRow}>
            <Text style={styles.sliderLabel}>0</Text>
            <Text style={[styles.sliderLabel, styles.sliderLabelMax]}>
              {formatCaloriesLabel(maxCalories)}
            </Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={maxCalories}
            step={10}
            value={caloriesTarget}
            onValueChange={setCaloriesTarget}
            minimumTrackTintColor="green"
            maximumTrackTintColor="#ddd"
          />
          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={handleSaveCaloriesTarget}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : step === 3 && selectedGoalType === 'Healthy snack streak' ? (
        <View style={styles.selectionContainer}>
          <Text style={styles.subSelectionTitle}>Set a streak for healthy snacks:</Text>
          <Text style={styles.caloriesDisplay}>{snackStreak} days</Text>
          <View style={styles.sliderLabelsRow}>
            <Text style={styles.sliderLabel}>0</Text>
            <Text style={styles.sliderLabel}>30</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={30}
            step={1}
            value={snackStreak}
            onValueChange={setSnackStreak}
            minimumTrackTintColor="green"
            maximumTrackTintColor="#ddd"
          />
          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={handleSaveSnackStreak}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : step === 3 && selectedGoalType === 'Number of workouts per week' ? (
        <View style={styles.selectionContainer}>
          <Text style={styles.subSelectionTitle}>Set a number of workouts for this week:</Text>
          <Text style={styles.caloriesDisplay}>{workoutsPerWeek} workouts</Text>
          <View style={styles.sliderLabelsRow}>
            <Text style={styles.sliderLabel}>0</Text>
            <Text style={styles.sliderLabel}>14</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={14}
            step={1}
            value={workoutsPerWeek}
            onValueChange={setWorkoutsPerWeek}
            minimumTrackTintColor="green"
            maximumTrackTintColor="#ddd"
          />
          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={handleSaveWorkoutsGoal}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fdfdfd',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 21,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'green',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: 50,
    color: 'white',
  },
  selectionContainer: {
    marginTop: 50,
    backgroundColor: '#e7f1ff',
    padding: 20,
    borderRadius: 12,
  },
  selectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  subSelectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 3,
  },
  radioSelected: {
    borderColor: 'green',
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: 'green',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  radioDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    maxWidth: 280,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#444',
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  caloriesDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  sliderLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#444',
  },
  sliderLabelMax: {
    fontSize: 10,
  },
});
