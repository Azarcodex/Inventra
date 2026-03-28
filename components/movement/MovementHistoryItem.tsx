import { StockMovement } from "@/modules/stock/stock.types";
import { formatDistanceToNow } from "date-fns";

interface MovementHistoryItemProps {
  movement: StockMovement;
}

export const MovementHistoryItem = ({ movement }: MovementHistoryItemProps) => {
  const getColors = () => {
    switch (movement.type) {
      case "PURCHASE":
        return { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "Purchase", symbol: "+" };
      case "SALE":
        return { bg: "bg-red-50 text-red-700 border-red-100", label: "Sale", symbol: "-" };
      case "ADJUSTMENT":
        return { bg: "bg-blue-50 text-blue-700 border-blue-100", label: "Adjustment", symbol: "" };
      default:
        return { bg: "bg-gray-50 text-gray-700 border-gray-100", label: "Unknown", symbol: "" };
    }
  };

  const { bg, label, symbol } = getColors();

  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md border ${bg}`}>
          {label}
        </div>
        <div>
          <p className={`text-lg font-bold ${movement.quantity < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {movement.quantity > 0 ? "+" : ""}{movement.quantity}
          </p>
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">
            Units {movement.type === "SALE" ? "Reduced" : movement.type === "PURCHASE" ? "Added" : "Adjusted"}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-700">
          {formatDistanceToNow(new Date(movement.createdAt), { addSuffix: true })}
        </p>
        <p className="text-[11px] text-gray-400">
          {new Date(movement.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
