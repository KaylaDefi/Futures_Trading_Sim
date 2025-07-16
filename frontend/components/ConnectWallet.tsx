"use client";

import React from "react";
import { useAccount } from "../context/AccountContext";
import { useWallet } from "../context/WalletContext";

const ConnectWallet: React.FC = () => {
  const { walletAddress, connectWallet, isConnected } = useWallet();
  const { balance: walletBalance } = useAccount();

  const shorten = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

  return (
    <div className="mb-4">
      {isConnected ? (
        <p className="text-green-600 font-medium break-words">
          Connected: {shorten(walletAddress!)} – Balance: {walletBalance.toFixed(2)}
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
};

export default ConnectWallet;
