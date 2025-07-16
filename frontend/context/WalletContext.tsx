"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

type WalletContextType = {
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error('User denied MetaMask connection');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  useEffect(() => {
    if ((window as any).ethereum && (window as any).ethereum.selectedAddress) {
      setWalletAddress((window as any).ethereum.selectedAddress);
    }
  }, []);

  const isConnected = !!walletAddress;

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, isConnected }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};
