"use client";

import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";

const ConnectWallet: React.FC = () => {
  const {
    walletAddress,
    connectWallet,
    disconnectWallet,
    isConnected,
    balance,
    network,
  } = useWallet();

  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const shorten = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

  return (
    <div className="mb-4">
      {isConnected ? (
        <>
          <p className="text-green-600 font-medium break-words">
            Connected: {walletAddress ? shorten(walletAddress) : "Unknown"} on{" "}
            {network ?? "Unknown"}
          </p>
          <p className="text-sm text-gray-600">
            Balance: {balance.toFixed(4)} ETH
          </p>
          <button
            onClick={disconnectWallet}
            className="mt-2 text-sm underline text-red-500"
          >
            Disconnect
          </button>
        </>
      ) : (
        <>
          {!showWalletOptions ? (
            <button
              onClick={() => setShowWalletOptions(true)}
              className="bg-purple-600 text-white font-semibold p-2 rounded hover:bg-purple-700"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => connectWallet("MetaMask")}
                className="bg-yellow-500 text-black font-semibold p-2 rounded hover:bg-yellow-600 w-full"
              >
                Connect MetaMask
              </button>
              <button
                onClick={() => connectWallet("Phantom")}
                className="bg-violet-600 text-white font-semibold p-2 rounded hover:bg-violet-700 w-full"
              >
                Connect Phantom
              </button>
              <button
                onClick={() => setShowWalletOptions(false)}
                className="text-sm underline text-gray-500"
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectWallet;
