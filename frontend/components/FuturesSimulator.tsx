"use client";

import { useEffect, useState } from "react";

export default function FuturesSimulator() {
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [leverage, setLeverage] = useState(3);
  const [positionType, setPositionType] = useState("SHORT");
  const [liquidationPrice, setLiquidationPrice] = useState<number | null>(null);

  const calculate = async () => {
    const wasm = await import("../public/wasm/trading_sim/trading_sim.js" as string) as any;

    await wasm.default(); // Initialize WASM
    const liq = wasm.calculate_liquidation_price(entryPrice, leverage, positionType);
    setLiquidationPrice(liq);
  };

  useEffect(() => {
    const fetchPrice = async () => {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
      const data = await res.json();
      const price = data.bitcoin.usd;
      setLivePrice(price);
    };
  
    fetchPrice(); 
    const interval = setInterval(fetchPrice, 10000); 
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
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          Futures Trading Simulator
        </h1>
        <p className="text-sm text-gray-500 mb-4">
        Live Bitcoin (BTC) Price: {livePrice ? `$${livePrice.toLocaleString()}` : "Loading..."}
        </p>
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-800 mb-1">Entry Price:</label>
            <input
              type="number"
              value={entryPrice ?? ""}
  onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
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
            Calculate Liquidation Price
          </button>

          {liquidationPrice !== null && (
            <div className="mt-4 text-green-600 font-semibold text-lg">
              Liquidation Price: ${liquidationPrice.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
