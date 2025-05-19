import { View, Text, StyleSheet } from 'react-native';

export default function NutritionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snack Suggestion</Text>
      <Text style={styles.subtext}>Your recommended snack will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // Clean iOS-style background
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'tomato',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
