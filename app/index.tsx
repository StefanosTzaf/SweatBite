import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function HomeScreen() {
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');

  const handleCalculate = () => {
    alert(`Υπολογισμός θερμίδων για ${workoutType}, διάρκεια: ${duration} λεπτά`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Calculation of calories</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Workout type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={workoutType}
            onValueChange={(itemValue) => setWorkoutType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="type" value="" />
            <Picker.Item label="Running" value="running" />
            <Picker.Item label="Cycling" value="cycling" />
            <Picker.Item label="Swimming" value="swimming" />
            <Picker.Item label="HIIT" value="hiit" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Duration</Text>
        <TextInput
          style={styles.input}
          placeholder="minutes of training"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCalculate}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});