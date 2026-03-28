import { StockoutRisk as StockoutRiskType } from "@/types/analytics.types";

interface Props {
  data?: StockoutRiskType[];
  isLoading?: boolean;
}

export const StockoutRisk = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow animate-pulse">
        <h3 className="h-6 bg-gray-100 rounded w-32 mb-4"></h3>
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
              <div className="h-4 bg-gray-50 rounded w-32"></div>
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
        <h3 className="text-lg font-bold mb-2 text-gray-800 self-start">Stockout Risk</h3>
        <p className="text-sm">No inventory risk data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Stockout Risk</h3>
      <div className="flex flex-col gap-2">
        {data.map((risk) => {
          let riskColor = "text-green-500";
          if (risk.riskLevel === "HIGH") riskColor = "text-red-500";
          else if (risk.riskLevel === "MEDIUM") riskColor = "text-yellow-500";

          return (
            <div key={risk.productId} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100">
              <span className="text-gray-600 truncate mr-4">{risk.name}</span>
              <div className="flex gap-4 items-center shrink-0">
                <span className="text-sm w-24 text-right">
                  {risk.daysRemaining !== null ? `${risk.daysRemaining} days left` : "N/A"}
                </span>
                <span className={`font-bold text-sm w-16 text-right ${riskColor}`}>
                  {risk.riskLevel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
