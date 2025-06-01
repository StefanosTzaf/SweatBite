import { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SnackStepContext } from '../context/SnackStepContext';

export default function SnackSuggestionTab() {
  const { step, setStep } = useContext(SnackStepContext);

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedIntensity, setSelectedIntensity] = useState(null);

  const handleFirstConfirm = () => {
    if (selectedOption === 'Pre workout' || selectedOption === 'After workout') {
      setStep(2);
    }
  };

  const handleFinalConfirm = () => {
    alert(`Confirmed: ${selectedOption} - Intensity: ${selectedIntensity}`);
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Snack suggestion</Text>
        <Text style={styles.subtitle}>Select a snack for:</Text>

        <View style={styles.radioGroup}>
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
      </View>
    );
  }

  if (selectedOption === 'Pre workout') {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Select an intensity for your workout:</Text>
        <View style={styles.radioGroup}>
          {[
            { label: 'Low', desc: 'Light movement (yoga, walking)' },
            { label: 'Medium', desc: 'Steady workout (weights, cycling)' },
            { label: 'High', desc: 'Intense effort (HIIT, sprinting)' },
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
        </View>

        {selectedIntensity && (
          <Pressable style={styles.confirmButton} onPress={handleFinalConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (selectedOption === 'After workout') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>After Workout</Text>
        <Text style={styles.subtitle}>This is a placeholder screen for after workout snack suggestions.</Text>

        <Pressable
          style={[styles.confirmButton, { marginTop: 40, backgroundColor: 'tomato' }]}
          onPress={() => setStep(1)}
        >
          <Text style={styles.confirmButtonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fdfdfd' },
  title: { fontWeight: 'bold', fontSize: 24, marginBottom: 40, color: 'black' },
  subtitle: { fontSize: 18, marginBottom: 40, color: '#555' },
  radioGroup: { marginBottom: 40 },
  radioButtonContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 30 },
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
  radioButtonInner: { height: 16, width: 16, borderRadius: 8, backgroundColor: 'black' },
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
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
