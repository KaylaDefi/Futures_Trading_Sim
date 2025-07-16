"use client";

import { useEffect, useState } from "react";
import { useAccount } from "../context/AccountContext";
import ConnectWallet from "./ConnectWallet";
import PriceDisplay from "./PriceDisplay";
import TradeForm from "./TradeForm";

type PositionType = "LONG" | "SHORT";

export default function FuturesSimulatorApp() {
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [leverage, setLeverage] = useState(3);
  const { balance: walletBalance } = useAccount(); // ✅ use global balance
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
  <div className="page">
    <div className="card">
      <ConnectWallet />
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
        <div className="result green">
          Liquidation Price: ${liquidationPrice.toFixed(2)}
        </div>
      )}

      {positionSize !== null && (
        <div className="result blue">
          Position Size: {positionSize.toFixed(4)} BTC
        </div>
      )}
    </div>
  </div>
);
}
