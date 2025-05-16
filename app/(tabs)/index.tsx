import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [selected, setSelected] = useState('Tab1');

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      {/* Two small tabs */}
      <View style={styles.smallTabs}>
        {['Tab1', 'Tab2'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, selected === tab && styles.tabSelected]}
            onPress={() => setSelected(tab)}
          >
            <Text style={selected === tab ? styles.tabTextSelected : styles.tabText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text>{selected} Content goes here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  smallTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginHorizontal: 5,
  },
  tabSelected: {
    borderBottomColor: 'blue',
  },
  tabText: {
    color: 'gray',
  },
  tabTextSelected: {
    color: 'blue',
    fontWeight: 'bold',
  },
  content: {
    marginTop: 20,
    alignItems: 'center',
  },
});
