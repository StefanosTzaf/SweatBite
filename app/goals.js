import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { GoalsContext } from '../context/GoalsContext';

const GOAL_TYPES = [
  {
    label: 'Calories burned',
    description: 'Set a target to hit weekly or daily',
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
  const { goals, setGoals } = useContext(GoalsContext);
  const [showSetGoal, setShowSetGoal] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedGoalType, setSelectedGoalType] = useState(null);
  const [caloriesPeriod, setCaloriesPeriod] = useState(null);
  const [caloriesTarget, setCaloriesTarget] = useState(500);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(3);

  useEffect(() => {
    const loadGoals = async () => {
      const savedGoals = await AsyncStorage.getItem('goals');
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    };
    loadGoals();
  }, []);

  const saveGoals = async (newGoals) => {
    setGoals(newGoals);
    await AsyncStorage.setItem('goals', JSON.stringify(newGoals));
  };

  const handleAddGoalPress = () => {
    setShowSetGoal(true);
    setStep(1);
    setSelectedGoalType(null);
    setCaloriesPeriod(null);
    setCaloriesTarget(500);
    setWorkoutsPerWeek(3);
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

  const addGoal = async (goal) => {
    const updatedGoals = [...goals, goal];
    await saveGoals(updatedGoals);
    setShowSetGoal(false);
  };

  const handleSaveCaloriesTarget = () => {
    addGoal({
      type: 'Calories burned',
      period: caloriesPeriod,
      target: caloriesTarget,
      progress: 0,
    });
  };

  const handleSaveWorkoutsGoal = () => {
    addGoal({
      type: 'Number of workouts per week',
      target: workoutsPerWeek,
      progress: 0,
    });
  };

  const handleCancel = () => {
    setShowSetGoal(false);
  };

  const handleDeleteGoal = async (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    await saveGoals(updatedGoals);
  };

  const maxCalories = caloriesPeriod === 'Weekly' ? 10000 : 1500;

  const formatCaloriesLabel = (value) => {
    if (value >= 10000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  const renderProgressCard = (goal, index) => {
    const percentage = goal.progress / goal.target;
    let label = '';
    if (goal.type === 'Number of workouts per week') {
      label = `${goal.progress} / ${goal.target} workouts done`;
    } else {
      label = `${goal.progress} / ${goal.target} calories burned`;
    }

    return (
      <View key={index} style={styles.goalCard}>
        <Text style={styles.goalTitle}>
          {goal.type === 'Number of workouts per week'
            ? `Do ${goal.target} workouts this week`
            : `Burn ${goal.target} calories (${goal.period})`}
        </Text>
        <ProgressBar progress={percentage} color="green" style={styles.progressBar} />
        <Text style={styles.goalSubtitle}>{label}</Text>
        <Pressable onPress={() => handleDeleteGoal(index)} style={styles.trashIcon}>
          <Icon name="trash-2" size={22} color="#900" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!showSetGoal ? (
        <>
          <Text style={styles.title}>Your current goals</Text>
          {goals.length === 0 ? (
            <>
              <Text style={styles.subtitle}>No goals yet</Text>
              <Text style={styles.subtitle}>Tap + to set your first goal</Text>
            </>
          ) : (
            <ScrollView style={{ marginBottom: 80 }}>
              {goals.map((goal, index) => renderProgressCard(goal, index))}
            </ScrollView>
          )}

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
                onPress={() => setSelectedGoalType(label)}
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
            <Pressable style={[styles.button]} onPress={handleSaveGoalType}>
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
            <Pressable style={styles.button} onPress={handleSaveCaloriesPeriod}>
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
      ) : step === 3 && selectedGoalType === 'Number of workouts per week' ? (
        <View style={styles.selectionContainer}>
          <Text style={styles.subSelectionTitle}>Set a number of workouts for this week:</Text>
          <Text style={styles.caloriesDisplay}>{workoutsPerWeek} workouts</Text>
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
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'green',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addButtonText: {
    fontSize: 40,
    color: 'white',
  },
  goalCard: {
    backgroundColor: '#e0fce6',
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    position: 'relative',
  },
  goalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  goalSubtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  trashIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  selectionContainer: {
    marginTop: 50,
    backgroundColor: '#e6f4ea',
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

