"use client";

import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

type WalletContextType = {
  walletAddress: string | null;
  isConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  balance: number;
  network: string | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<string | null>(null);

  const connectWallet = async () => {
  const { ethereum } = window as any;

  if (!ethereum || !ethereum.request || !ethereum.isMetaMask) {
    alert("MetaMask not detected.");
    return;
  }

  try {
    const accounts: string[] = await ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    const rawBalance = await provider.getBalance(userAddress);
    const formattedBalance = parseFloat(ethers.formatEther(rawBalance));

    const networkInfo = await provider.getNetwork();

    setWalletAddress(userAddress);
    setIsConnected(true);
    setBalance(formattedBalance);
    setNetwork(networkInfo.name);
  } catch (err) {
    console.error("Failed to connect wallet:", err);
  }
};


  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    setBalance(0);
    setNetwork(null);
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnected,
        connectWallet,
        disconnectWallet,
        balance,
        network,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};
