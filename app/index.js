import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
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
    <TouchableWithoutFeedback onPress={handleTapOutside}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topHalf}>
          <Text style={styles.label}>Workout type</Text>
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
            dropDownContainerStyle={{ maxHeight: 200, borderColor: '#ccc' }}
            listMode="SCROLLVIEW"
            scrollViewProps={{ nestedScrollEnabled: true }}
          />

          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
            placeholder="minutes of workout"
            placeholderTextColor="#aaa"
          />
        </View>

        <Button title="Calculate" onPress={handleCalculate} />
      </ScrollView>
    </TouchableWithoutFeedback>
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
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    padding: 10,
    fontSize: 16,
    color: '#333',
    width: '50%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    width: '50%',
  },
});
