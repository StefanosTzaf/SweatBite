import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function SnackSuggestionTab() {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snack suggestion</Text>
      <Text style={styles.subtitle}>Select a snack for:</Text>

      <View style={styles.radioGroup}>
        <Pressable
          style={styles.radioButtonContainer}
          onPress={() => setSelectedOption('Pre workout')}
        >
          <View style={styles.radioButtonOuter}>
            {selectedOption === 'Pre workout' && <View style={styles.radioButtonInner} />}
          </View>
          <View>
            <Text style={styles.radioLabel}>Pre workout</Text>
            <Text style={styles.description}>Light energy boost before training</Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.radioButtonContainer}
          onPress={() => setSelectedOption('After workout')}
        >
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
        <Pressable style={styles.confirmButton} onPress={() => alert(`Confirmed: ${selectedOption}`)}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </Pressable>
      )}
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
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 75,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#555',
  },
  radioGroup: {
    marginTop: 15,
    marginBottom: 40,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
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
    backgroundColor: 'tomato',
  },
  radioLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
confirmButton: {
  position: 'relative', // ή 'absolute' αν θες πιο απόλυτο positioning
  alignSelf: 'flex-end', // για να πάει δεξιά
  backgroundColor: 'green',
  paddingHorizontal: 30,
  paddingVertical: 14,
  borderRadius: 30,
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  marginTop: 20, // λίγο κενό πάνω από το κουμπί
},
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
