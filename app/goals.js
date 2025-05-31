import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function GoalsTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goals</Text>
      <Text style={styles.subtitle}>No goals yet :(</Text>
      <Text style={styles.subtitle}>Tap + to set your first goals</Text>

      <Pressable style={styles.addButton} onPress={() => alert('Add goal')}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
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
    marginBottom: 100,
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
  backgroundColor: 'green', // changed from 'tomato' to green
  width: 80,
  height: 80,
  borderRadius: 40,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
},

  addButtonText: {
    fontSize: 50,
    color: 'white',
    lineHeight: 50,
  },
});
