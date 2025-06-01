import React, { createContext, useState } from 'react';

export const SnackStepContext = createContext();

export function SnackStepProvider({ children }) {
  const [step, setStep] = useState(1);

  return (
    <SnackStepContext.Provider value={{ step, setStep }}>
      {children}
    </SnackStepContext.Provider>
  );
}