"use client";

import { useEffect, useState } from "react";
import { useAccount } from "../context/AccountContext";
import ConnectWallet from "./ConnectWallet";
import PriceDisplay from "./PriceDisplay";
import TradeForm from "./TradeForm";
import { useWallet } from "context/WalletContext";

type PositionType = "LONG" | "SHORT";

export default function FuturesSimulatorApp() {
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [leverage, setLeverage] = useState(3);
  const { balance: walletBalance } = useWallet(); 
  const [positionType, setPositionType] = useState<PositionType>("SHORT");
  const [liquidationPrice, setLiquidationPrice] = useState<number | null>(null);
  const [positionSize, setPositionSize] = useState<number | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number>(0.01); // user input ETH amount

  const calculate = async () => {
    const wasm: any = await import("../public/wasm/trading_sim/trading_sim.js");
    await wasm.default();

    if (
      entryPrice !== null &&
      leverage > 0 &&
      tradeAmount > 0 &&
      tradeAmount <= walletBalance
   ) {
      const liq = wasm.calculate_liquidation_price(entryPrice, leverage, positionType);
      setLiquidationPrice(liq);

      const size = tradeAmount * leverage
      setPositionSize(size);
  } else {
    alert("Invalid input: Please check trade amount and leverage.");
  }
};

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/price");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        const price = data.ethereum.usd;
        setLivePrice((prev) => (prev !== price ? price : prev));
      } catch (err) {
        console.error("Failed to fetch ETH price:", err);
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

      <div className="mb-4">
        <label className="block font-medium text-sm text-gray-700">
          Trade Amount (ETH):
        </label>
        <input
          type="number"
          value={tradeAmount}
          onChange={(e) => setTradeAmount(parseFloat(e.target.value))}
          min="0"
          max={walletBalance}
          step="0.001"
          className="w-full p-2 mt-1 border rounded"
        />
        {tradeAmount > walletBalance && (
          <p className="text-red-500 text-sm mt-1">
            Amount exceeds wallet balance!
          </p>
        )}
      </div>

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
          Trade Amount: {tradeAmount} ETH<br />
          Position Size: {positionSize.toFixed(4)} ETH
        </div>
      )}
    </div>
  </div>
);
}
