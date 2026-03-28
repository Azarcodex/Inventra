import { DeadStockProduct } from "@/types/analytics.types";

interface Props {
  data?: DeadStockProduct[];
  isLoading?: boolean;
}

export const DeadStockList = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow animate-pulse">
        <h3 className="h-6 bg-gray-100 rounded w-32 mb-4"></h3>
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
              <div className="h-4 bg-gray-50 rounded w-36"></div>
              <div className="h-4 bg-gray-50 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center min-h-[200px] text-gray-400">
        <h3 className="text-lg font-bold mb-2 text-gray-800 self-start">Dead Stock</h3>
        <p className="text-sm">No slow-moving or dead stock identified.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Dead Stock</h3>
      <div className="flex flex-col gap-2">
        {data.map((product) => (
          <div key={product.productId} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100">
            <span className="text-gray-600 truncate mr-4">
              {product.name} <span className="text-xs text-gray-400">({product.stock} left)</span>
            </span>
            <span className="font-medium text-red-500 shrink-0">
              {product.daysSinceLastSale} days stagnant
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
