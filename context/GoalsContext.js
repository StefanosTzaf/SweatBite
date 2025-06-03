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

  // type: Calories burned or number of workouts
  // period: daily, weekly or undefined
  // valueToAdd: the amount to add to the current progress
  const updateGoalProgress = async(type, period, valueToAdd) => {
    let updated = false;
    const updatedGoals = goals.map((goal) => {
      //if the period is undefined, it matches all periods
      if (goal.type.tolowerCase() === type.tolowerCase && (!period || goal.period.tolowerCase() === period.tolowerCase())) {
        
        updated = true; 
        
        // the new progress is the sum of the current progress and the value to add
        // goal.progress || 0 ensures that if progress is undefined, it starts from 0
        const newProgress = (goal.progress || 0) + valueToAdd;
       
        return { ...goal, progress: newProgress };
      }

      // if the goal doesn't match, return it unchanged
      return goal;
    });

    // if at least one goal was updated
    if (updated) {

      //replace old list of goals with the new one
      setGoals(updatedGoals);

      // save the list to the device's storage
      await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    }
  };

  return (
    <GoalsContext.Provider value={{ goals, setGoals, updateGoalProgress }}>
      {children}
    </GoalsContext.Provider>
  );
}
