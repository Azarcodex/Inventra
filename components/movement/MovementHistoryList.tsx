import { useMovementHistory } from "@/hooks/stock/useMovementHistory";
import { MovementHistoryItem } from "./MovementHistoryItem";
import { Product } from "@/modules/product/product.types";
import { MESSAGES } from "@/constants/messages";

interface MovementHistoryListProps {
  product: Product;
}

export const MovementHistoryList = ({ product }: MovementHistoryListProps) => {
  const { data: movements, isLoading, error } = useMovementHistory(product.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-xl border border-red-200">
        <p className="text-red-600 font-semibold tracking-tight">
          {MESSAGES.HISTORY_LOAD_ERROR}
        </p>
        <p className="text-xs text-red-500 mt-1 uppercase tracking-wider font-bold">
          API Error occurred
        </p>
      </div>
    );
  }

  if (!movements || movements.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200 border-dashed">
        <p className="text-gray-500 font-medium tracking-tight italic">
          {MESSAGES.NO_HISTORY_FOUND}
        </p>
        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">
          History Empty
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Transaction History</h3>
         <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{movements.length} Total</span>
      </div>
      <div className="max-h-[400px] overflow-y-auto pr-1 flex flex-col gap-3 scrollbar-hide hover:scrollbar-default">
        {movements.map((movement) => (
          <MovementHistoryItem key={movement.id} movement={movement} />
        ))}
      </div>
    </div>
  );
};
