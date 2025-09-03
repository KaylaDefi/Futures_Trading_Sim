"use client";

import { useEffect, useState } from "react";
import ConnectWallet from "./ConnectWallet";
import PriceDisplay from "./PriceDisplay";
import TradeForm from "./TradeForm";
import { useWallet } from "context/WalletContext";

type PositionType = "LONG" | "SHORT";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function FuturesSimulatorApp() {
  const { isConnected } = useWallet();
  const walletBalance = 0; 
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [leverage, setLeverage] = useState(3); useWallet(); 
  const [positionType, setPositionType] = useState<PositionType>("SHORT");
  const [liquidationPrice, setLiquidationPrice] = useState<number | null>(null);
  const [positionSize, setPositionSize] = useState<number | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number>(0.01); 
  const [openPosition, setOpenPosition] = useState<{
    entryPrice: number;
    leverage: number;
    positionSize: number;
    tradeAmount: number;
    positionType: PositionType;
    } | null>(null);
  const [pnl, setPnl] = useState<number | null>(null);
  const [enteredPosition, setEnteredPosition] = useState<boolean>(false);

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

      const size = (tradeAmount * leverage) / entryPrice;
      setPositionSize(size);
    } else {
      alert("Invalid input: Please check trade amount and leverage.");
    }
  };

  const enterTrade = () => {
    if (
      entryPrice !== null &&
      leverage > 0 &&
      tradeAmount > 0 &&
      positionSize !== null
    ) {
      setOpenPosition({
        entryPrice,
        leverage,
        tradeAmount,
        positionSize,
        positionType,
      });
      setPnl(null); 
    }
  }; 

  const exitTrade = () => {
    if (!openPosition || livePrice === null) return;

    const { entryPrice, positionSize, positionType } = openPosition;
    const priceDiff =
      positionType === "LONG"
        ? livePrice - entryPrice
        : entryPrice - livePrice;

    const profit = priceDiff * positionSize;
    setPnl(profit);
    setOpenPosition(null); 
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

      {openPosition === null && positionSize !== null && (
          <button
            onClick={enterTrade}
            className="mt-4 bg-green-600 text-white font-semibold p-2 rounded hover:bg-green-700"
          >
            Enter Trade
          </button>
        )}

        {openPosition !== null && (
          <button
            onClick={exitTrade}
            className="mt-4 bg-red-600 text-white font-semibold p-2 rounded hover:bg-red-700"
          >
            Exit Trade
          </button>
        )}

        {pnl !== null && (
          <div
            className={`mt-4 font-semibold text-lg ${
              pnl >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            PnL: {pnl >= 0 ? "+" : "-"}{Math.abs(pnl).toFixed(4)} ETH
          </div>
        )}
      </div>
    </div>
  );
}
