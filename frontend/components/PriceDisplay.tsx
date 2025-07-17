interface PriceDisplayProps {
    livePrice: number | null;
    walletBalance: number;
  }
  
  export default function PriceDisplay({ livePrice, walletBalance }: PriceDisplayProps) {
    return (
      <>
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          Futures Trading Simulator
        </h1>
        <p className="text-sm text-gray-500 mb-2">
          Live Ethereum Price (USD): {livePrice ? `$${livePrice.toLocaleString()}` : "Loading..."}
        </p>
        <p className="text-sm text-gray-700 mb-4">
          Wallet Balance (ETH): {walletBalance.toFixed(4)} ETH
        </p>
      </>
    );
  }
  