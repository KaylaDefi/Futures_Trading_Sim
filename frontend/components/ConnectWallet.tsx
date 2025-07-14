"use client";

import { useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface ConnectWalletProps {
  setWalletBalance: (balance: number) => void;
  onAccountConnected?: (address: string) => void;
}

export default function ConnectWallet({ setWalletBalance, onAccountConnected }: ConnectWalletProps) {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0];
        setAccount(address);
        if (onAccountConnected) onAccountConnected(address);

        const balanceWei = await provider.getBalance(address);
        const balanceEth = parseFloat(ethers.formatEther(balanceWei));
        setWalletBalance(balanceEth);
      } catch (err) {
        console.error("MetaMask connection error:", err);
      }
    } else {
      alert("MetaMask not detected. Please install it.");
    }
  };

  return (
    <div className="mb-4">
      {account ? (
        <p className="text-green-600 font-medium break-words">
          Connected: {account}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-600 text-white font-semibold p-2 rounded hover:bg-purple-700"
        >
          Connect MetaMask
        </button>
      )}
    </div>
  );
}
