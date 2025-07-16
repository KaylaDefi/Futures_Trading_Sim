"use client";

import React from "react";
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
