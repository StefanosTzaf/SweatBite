import React, { createContext, useState, useContext } from 'react';
import { GoalsContext } from './GoalsContext';

export const WorkoutsContext = createContext();

export function WorkoutsProvider({ children }) {
  const [workouts, setWorkouts] = useState([]);
  const { goals, updateProgress } = useContext(GoalsContext);

  // Προσθήκη workout
  const addWorkout = (workout) => {
    setWorkouts((prev) => [...prev, workout]);

    // Ενημέρωση στόχων βάσει workout
    goals.forEach((goal, index) => {
      if (goal.type === 'Number of workouts per week') {
        updateProgress(index, goal.progress + 1);
      }
      if (goal.type === 'Calories burned') {
        updateProgress(index, Math.min(goal.progress + workout.calories, goal.target));
      }
    });
  };

  return (
    <WorkoutsContext.Provider value={{ workouts, addWorkout }}>
      {children}
    </WorkoutsContext.Provider>
  );
}
