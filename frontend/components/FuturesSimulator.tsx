"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
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
        <p className="text-green-600 font-medium">Connected: {account}</p>
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

export default function FuturesSimulatorApp() {
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [leverage, setLeverage] = useState(3);
  const [balance, setBalance] = useState(1000); // New: user’s account balance
  const [positionType, setPositionType] = useState("SHORT");
  const [liquidationPrice, setLiquidationPrice] = useState<number | null>(null);
  const [positionSize, setPositionSize] = useState<number | null>(null); // New

  const calculate = async () => {
    const wasm = await import("../public/wasm/trading_sim/trading_sim.js" as string) as any;
    await wasm.default(); // Initialize WASM

    if (entryPrice && leverage) {
      const liq = wasm.calculate_liquidation_price(entryPrice, leverage, positionType);
      setLiquidationPrice(liq);

      const size = (balance * leverage) / entryPrice;
      setPositionSize(size);
    }
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/price");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        const price = data.bitcoin.usd;

        console.log("Fetched price:", price);
        setLivePrice((prev) => {
          if (prev !== price) {
            return price; 
          }
          return prev;
        });
      } catch (err) {
        console.error("Failed to fetch BTC price:", err);
      }
    };

    fetchPrice(); 
    const interval = setInterval(fetchPrice, 20000); 
    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    if (livePrice && entryPrice === null) {
      setEntryPrice(livePrice);
    }
  }, [livePrice]);

  return (
    <div className="grid place-items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-gray-50 shadow-xl rounded-2xl p-6 max-w-md w-full">

        <ConnectWallet />  

        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          Futures Trading Simulator
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Live Bitcoin (BTC) Price: {livePrice ? `$${livePrice.toLocaleString()}` : "Loading..."}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-800 mb-1">Account Balance ($):</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value))}
              className="w-full p-2 border rounded text-gray-900"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-800 mb-1">Entry Price:</label>
            <input
              type="number"
              value={entryPrice ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setTimeout(() => {
                    if (livePrice !== null) {
                      setEntryPrice(livePrice);
                    }
                  }, 500);
                } else {
                  const parsed = parseFloat(value);
                  if (!isNaN(parsed)) setEntryPrice(parsed);
                }
              }}
              className="w-full p-2 border rounded text-gray-900"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-800 mb-1">Leverage:</label>
            <input
              type="number"
              value={leverage}
              onChange={(e) => setLeverage(parseFloat(e.target.value))}
              className="w-full p-2 border rounded text-gray-900"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-800 mb-1">Position Type:</label>
            <select
              value={positionType}
              onChange={(e) => setPositionType(e.target.value)}
              className="w-full p-2 border rounded text-gray-900"
            >
              <option value="LONG">Long</option>
              <option value="SHORT">Short</option>
            </select>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700"
          >
            Calculate Liquidation Price and Position Size
          </button>

          {liquidationPrice !== null && (
            <div className="mt-4 text-green-600 font-semibold text-lg">
              Liquidation Price: ${liquidationPrice.toFixed(2)}
            </div>
          )}

          {positionSize !== null && (
            <div className="mt-2 text-blue-600 font-semibold text-lg">
              Position Size: {positionSize.toFixed(4)} BTC
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
