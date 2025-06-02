import React, { createContext, useState } from 'react';

export const ProgressContext = createContext({
  progress: 0,
  setProgress: () => {},
});

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(0);

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}