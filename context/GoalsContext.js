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

  // Update progress for a specific goal
  const updateGoalProgress = async (type, period, valueToAdd) => {
    let updated = false;
    const updatedGoals = goals.map((goal) => {
      if (goal.type === type && (!period || goal.period === period)) {
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