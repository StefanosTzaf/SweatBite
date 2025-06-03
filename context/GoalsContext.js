import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GoalsContext = createContext({
  goals: [],
  setGoals: () => {},
  updateGoalProgress: () => {},
});

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const loadGoals = async () => {
      const savedGoals = await AsyncStorage.getItem('goals');
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    };
    loadGoals();
  }, []);

  const updateGoalProgress = async (type, period, valueToAdd) => {
    const savedGoals = await AsyncStorage.getItem('goals');
    const currentGoals = savedGoals ? JSON.parse(savedGoals) : goals;

    let updated = false;
    const updatedGoals = currentGoals.map((goal) => {
      if (
        goal.type &&
        goal.type.toLowerCase() === type.toLowerCase() &&
        (!period || (goal.period && goal.period.toLowerCase() === period.toLowerCase()))
      ) {
        updated = true;
        const newProgress = (goal.progress || 0) + valueToAdd;
        return { ...goal, progress: newProgress };
      }
      return goal;
    });

    if (updated) {
      setGoals(updatedGoals);
      await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    }
  };

  return (
    <GoalsContext.Provider value={{ goals, setGoals, updateGoalProgress }}>
      {children}
    </GoalsContext.Provider>
  );
}