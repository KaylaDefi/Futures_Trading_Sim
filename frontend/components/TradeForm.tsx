interface TradeFormProps {
    entryPrice: number | null;
    livePrice: number | null;
    leverage: number;
    positionType: string;
    onEntryPriceChange: (value: number | null) => void;
    onLeverageChange: (value: number) => void;
    onPositionTypeChange: (value: string) => void;
    onCalculate: () => void;
  }
  
  export default function TradeForm({
    entryPrice,
    livePrice,
    leverage,
    positionType,
    onEntryPriceChange,
    onLeverageChange,
    onPositionTypeChange,
    onCalculate,
  }: TradeFormProps) {
    return (
      <div className="space-y-4">
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
                    onEntryPriceChange(livePrice);
                  }
                }, 500);
              } else {
                const parsed = parseFloat(value);
                if (!isNaN(parsed)) onEntryPriceChange(parsed);
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
            onChange={(e) => onLeverageChange(parseFloat(e.target.value))}
            className="w-full p-2 border rounded text-gray-900"
          />
        </div>
  
        <div>
          <label className="block font-medium text-gray-800 mb-1">Position Type:</label>
          <select
            value={positionType}
            onChange={(e) => onPositionTypeChange(e.target.value)}
            className="w-full p-2 border rounded text-gray-900"
          >
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </div>
  
        <button
          onClick={onCalculate}
          className="w-full bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700"
        >
          Calculate Liquidation Price and Position Size
        </button>
      </div>
    );
  }
  