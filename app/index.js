import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function HomeScreen() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Climbing', value: 'climbing' },
    { label: 'Cycling', value: 'cycling' },
    { label: 'Dance', value: 'dance' },
    { label: 'Home Workouts', value: 'home_workouts' },
    { label: 'Hiking', value: 'hiking' },
    { label: 'Jogging', value: 'jogging' },
    { label: 'Martial Arts', value: 'martial_arts' },
    { label: 'Pilates', value: 'pilates' },
    { label: 'Running', value: 'running' },
    { label: 'Swimming', value: 'swimming' },
    { label: 'Team Sports', value: 'team_sports' },
    { label: 'Walking', value: 'walking' },
    { label: 'Weightlifting', value: 'weightlifting' },
    { label: 'Yoga', value: 'yoga' },
  ]);

  const [duration, setDuration] = useState('');

  const handleCalculate = () => {
    if (value && duration) {
      alert(`Workout: ${value}\nDuration: ${duration} minutes`);
    } else {
      alert('Please select a workout and enter duration.');
    }
  };

  const handleTapOutside = () => {
    Keyboard.dismiss();
    setOpen(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={handleTapOutside}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topHalf}>
            <Text style={styles.label}>Workout Type</Text>
            <View style={styles.inputWrapper}>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select workout type"
                placeholderStyle={{ color: '#aaa' }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                listMode="SCROLLVIEW"
                scrollViewProps={{ nestedScrollEnabled: true }}
              />
            </View>

            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
              placeholder="Minutes"
              placeholderTextColor="#aaa"
            />
          </View>

          <Pressable style={styles.calculateButton} onPress={handleCalculate}>
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  topHalf: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'left',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
  },
  inputWrapper: {
    width: '50%',
    zIndex: 1000, // Helps dropdown appear above other elements
    marginBottom: 20,
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  input: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
    marginBottom: 20,
  },
  calculateButton: {
    backgroundColor: 'tomato',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    width: '60%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  calculateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
