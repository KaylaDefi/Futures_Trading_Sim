"use client";

import React, { createContext, useContext, useState } from 'react';

type AccountContextType = {
  balance: number;
  updateBalance: (amount: number) => void;
  resetBalance: () => void;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(1000); // Default balance for demo

  const updateBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const resetBalance = () => setBalance(1000);

  return (
    <AccountContext.Provider value={{ balance, updateBalance, resetBalance }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) throw new Error('useAccount must be used within an AccountProvider');
  return context;
};
