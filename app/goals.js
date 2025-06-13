import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { useContext, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
    if (selectedGoalType === 'Calories burned') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleSaveCaloriesPeriod = () => {
    setStep(3);
  };

  // NEW: AddGoal counts previous workouts in the correct period
  const addGoal = async (goal) => {
    const stored = await AsyncStorage.getItem('workouts');
    const workouts = stored ? JSON.parse(stored) : [];
    let progress = 0;
    const now = new Date();

    if (goal.type === 'Calories burned') {
      if (goal.period === 'Daily') {
        // Only workouts from today
        progress = workouts
          .filter(w => {
            const d = new Date(w.date);
            return (
              d.getFullYear() === now.getFullYear() &&
              d.getMonth() === now.getMonth() &&
              d.getDate() === now.getDate()
            );
          })
          .reduce((sum, w) => sum + w.caloriesBurned, 0);
      } else if (goal.period === 'Weekly') {
        // Only workouts from this week (Monday-Sunday)
        const day = now.getDay();
        const diffToMonday = (day === 0 ? -6 : 1) - day;
        const monday = new Date(now);
        monday.setHours(0, 0, 0, 0);
        monday.setDate(now.getDate() + diffToMonday);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        progress = workouts
          .filter(w => {
            const d = new Date(w.date);
            return d >= monday && d <= sunday;
          })
          .reduce((sum, w) => sum + w.caloriesBurned, 0);
      }
    } else if (goal.type === 'Number of workouts per week') {
      // Only workouts from this week (Monday-Sunday)
      const day = now.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const monday = new Date(now);
      monday.setHours(0, 0, 0, 0);
      monday.setDate(now.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      progress = workouts.filter(w => {
        const d = new Date(w.date);
        return d >= monday && d <= sunday;
      }).length;
    }

    const updatedGoals = [...goals, { ...goal, progress }];
    await saveGoals(updatedGoals);
    setShowSetGoal(false);
  };

  const handleSaveCaloriesTarget = () => {
    addGoal({
      type: 'Calories burned',
      period: caloriesPeriod,
      target: caloriesTarget,
    });
  };

  const handleSaveWorkoutsGoal = () => {
    addGoal({
      type: 'Number of workouts per week',
      target: workoutsPerWeek,
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

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

 // Helper to get week range string (e.g., 01/01/2022-08/01/2022)
const getWeekRange = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date();
  // Get first day of week (Monday)
  const day = date.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const format = (d) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  return `${format(monday)} - ${format(sunday)}`;
};

const renderProgressCard = (goal, index) => {
  // Clamp percentage to 1 (100%) and check if completed
  const percentage =
    typeof goal.target === 'number' && goal.target > 0
      ? Math.min(goal.progress / goal.target, 1)
      : 0;
  const isCompleted = goal.progress >= goal.target;

  let label = '';
  if (isCompleted) {
    label = '🎉 Completed!';
  } else if (goal.type === 'Number of workouts per week') {
    label = `${goal.progress} / ${goal.target} workouts done`;
  } else {
    label = `${goal.progress} / ${goal.target} calories burned`;
  }

  // Add period/date info
  let periodInfo = '';
  if (goal.type === 'Calories burned') {
    if (goal.period === 'Daily') {
      periodInfo = `Date: ${formatDate(goal.date || new Date())}`;
    } else if (goal.period === 'Weekly') {
      periodInfo = `Period: ${getWeekRange(goal.date)}`;
    }
  } else if (goal.type === 'Number of workouts per week') {
    periodInfo = `Week: ${getWeekRange(goal.date)}`;
  }

  return (
    <View
      key={index}
      style={[
        styles.goalCard,
        isCompleted && { opacity: 0.6, borderColor: 'green', borderWidth: 2 },
      ]}
    >
      <Text style={styles.goalTitleBig}>
        {goal.type === 'Number of workouts per week'
          ? `Do ${goal.target} workouts this week`
          : `Burn ${goal.target} calories (${goal.period})`}
      </Text>
      {periodInfo ? (
        <Text style={styles.periodInfoText}>
          {periodInfo}
        </Text>
      ) : null}
      <ProgressBar
        progress={percentage}
        color={isCompleted ? 'green' : 'gray'}
        style={styles.progressBar}
      />
      <Text
        style={[
          styles.goalSubtitle,
          isCompleted && { color: 'green', fontWeight: 'bold' },
        ]}
      >
        {label}
      </Text>
      <Pressable onPress={() => handleDeleteGoal(index)} style={styles.trashIcon}>
        <Icon name="trash-2" size={22} color="#900" />
      </Pressable>
    </View>
  );
};

  return (
    <View style={styles.container}>
      {showSetGoal && (
        <Pressable
         onPress={() => {
          if (step === 1) {
            setShowSetGoal(false);
            } else if (step === 3 && selectedGoalType === 'Number of workouts per week') {
              setStep(1);
            } else {
              setStep((prev) => prev - 1);
            }
          }}
          style={styles.backArrow}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </Pressable>
      )}
      {!showSetGoal ? (
        <>
          <Text style={styles.title}>Your current goals</Text>
          <Text style={[styles.subtitle, {textAlign: 'left'}, {fontSize: 14}]}>
            Choose what you want to focus on and track your progress
          </Text>
          {goals.length === 0 ? (
            <>
              <Text style={[styles.subtitle, { paddingTop: 200 }]}>No goals yet</Text>
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
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                !selectedGoalType && styles.confirmButtonDisabled
              ]}
              onPress={handleSaveGoalType}
              disabled={!selectedGoalType}
            >
              <Text style={styles.buttonText}>Confirm</Text>
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
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                !caloriesPeriod && styles.confirmButtonDisabled
              ]}
              onPress={handleSaveCaloriesPeriod}
              disabled={!caloriesPeriod}
            >
              <Text style={styles.buttonText}>Confirm</Text>
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
            step={50}
            value={caloriesTarget}
            onValueChange={setCaloriesTarget}
            minimumTrackTintColor="green"
            maximumTrackTintColor="#ddd"
          />
          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                caloriesTarget === 0 && styles.confirmButtonDisabled
              ]}
              onPress={handleSaveCaloriesTarget}
              disabled={caloriesTarget === 0}
            >
              <Text style={styles.buttonText}>Save</Text>
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
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                workoutsPerWeek === 0 && styles.confirmButtonDisabled
              ]}
              onPress={handleSaveWorkoutsGoal}
              disabled={workoutsPerWeek === 0}
            >
              <Text style={styles.buttonText}>Confirm</Text>
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
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
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
    height: 22,
    width: 22,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  radioSelected: {
    borderColor: '#555',
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: 'black',
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
  confirmButtonDisabled: {
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
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  goalTitleBig: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  periodInfoText: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: 'bold',
  },
});