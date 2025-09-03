"use client";

import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

type WalletOption = "MetaMask" | "Phantom" | null;

type WalletContextType = {
  walletAddress: string | null;
  isConnected: boolean;
  connectWallet: (walletType: WalletOption) => void;
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

  const getProvider = (walletType: WalletOption): any => {
    const globalEthereum = (window as any).ethereum;
    const phantomEthereum =
      (window as any).phantom?.ethereum || (window as any).phantom?.provider;

    if (!globalEthereum && !phantomEthereum) return null;

    if (globalEthereum?.providers) {
      if (walletType === "MetaMask")
        return globalEthereum.providers.find((p: any) => p.isMetaMask);
      if (walletType === "Phantom")
        return (
          globalEthereum.providers.find((p: any) => p.isPhantom) || phantomEthereum
        );
    }

    if (walletType === "MetaMask" && globalEthereum?.isMetaMask) return globalEthereum;
    if (walletType === "Phantom") {
      if (globalEthereum?.isPhantom) return globalEthereum;
      if (phantomEthereum) return phantomEthereum;
    }

    return null;
  };

  const connectWallet = async (walletType: WalletOption) => {
    const providerObj = getProvider(walletType);

    if (!providerObj) {
      alert(`${walletType} wallet not detected.`);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(providerObj);
      const accounts: string[] = await providerObj.request({
        method: "eth_requestAccounts",
      });

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
      console.error("Wallet connection failed:", err);
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
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
