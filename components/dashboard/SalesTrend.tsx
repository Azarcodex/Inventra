import { SalesTrendPoint } from "@/types/analytics.types";

interface Props {
  data?: SalesTrendPoint[];
  isLoading?: boolean;
}

export const SalesTrend = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow animate-pulse">
        <h3 className="h-6 bg-gray-100 rounded w-32 mb-4"></h3>
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
              <div className="h-4 bg-gray-50 rounded w-24"></div>
              <div className="h-4 bg-gray-50 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center min-h-[200px] text-gray-400">
        <h3 className="text-lg font-bold mb-2 text-gray-800 self-start">Sales Trend</h3>
        <p className="text-sm">No sales data recorded for this period.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Sales Trend</h3>
      <div className="flex flex-col gap-2">
        {data.map((point) => (
          <div key={point.date} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100">
            <span className="text-gray-600">{point.date}</span>
            <span className="font-medium">${point.revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
