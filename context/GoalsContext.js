// context/GoalsContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GoalsContext = createContext();

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState([]);

  // Φόρτωμα goals από AsyncStorage όταν φορτώνει το context
  useEffect(() => {
    async function loadGoals() {
      try {
        const savedGoals = await AsyncStorage.getItem('goals');
        if (savedGoals) setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error('Failed to load goals', e);
      }
    }
    loadGoals();
  }, []);

  // Συνάρτηση που αποθηκεύει goals και στο AsyncStorage
  const saveGoals = async (newGoals) => {
    setGoals(newGoals);
    try {
      await AsyncStorage.setItem('goals', JSON.stringify(newGoals));
    } catch (e) {
      console.error('Failed to save goals', e);
    }
  };

  // Για να προσθέτεις goal
  const addGoal = (goal) => {
    const updatedGoals = [...goals, goal];
    saveGoals(updatedGoals);
  };

  // Για να διαγράφεις goal
  const deleteGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    saveGoals(updatedGoals);
  };

  // Για να ενημερώνεις progress κάποιου goal
  const updateProgress = (index, progress) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, progress } : goal
    );
    saveGoals(updatedGoals);
  };

  return (
    <GoalsContext.Provider
      value={{ goals, addGoal, deleteGoal, updateProgress }}
    >
      {children}
    </GoalsContext.Provider>
  );
}
