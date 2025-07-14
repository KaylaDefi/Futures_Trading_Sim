"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ConnectWallet from "./ConnectWallet";
import PriceDisplay from "./PriceDisplay";
import TradeForm from "./TradeForm";

type PositionType = "LONG" | "SHORT";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function FuturesSimulatorApp() {
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [leverage, setLeverage] = useState(3);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [positionType, setPositionType] = useState<PositionType>("SHORT");
  const [liquidationPrice, setLiquidationPrice] = useState<number | null>(null);
  const [positionSize, setPositionSize] = useState<number | null>(null);

  const calculate = async () => {
    const wasm: any = await import("../public/wasm/trading_sim/trading_sim.js");
    await wasm.default();

    if (entryPrice !== null && leverage > 0) {
      const liq = wasm.calculate_liquidation_price(entryPrice, leverage, positionType);
      setLiquidationPrice(liq);

      const size = (walletBalance * leverage) / entryPrice;
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
        setLivePrice((prev) => (prev !== price ? price : prev));
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
        <ConnectWallet setWalletBalance={setWalletBalance} />
        <PriceDisplay livePrice={livePrice} walletBalance={walletBalance} />
        <TradeForm
          entryPrice={entryPrice}
          livePrice={livePrice}
          leverage={leverage}
          positionType={positionType}
          onEntryPriceChange={setEntryPrice}
          onLeverageChange={setLeverage}
          onPositionTypeChange={(value: string) => setPositionType(value as PositionType)}
          onCalculate={calculate}
        />

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
  );
}
