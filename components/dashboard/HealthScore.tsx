import { InventoryHealth } from "@/types/analytics.types";

interface Props {
  data?: InventoryHealth;
  isLoading?: boolean;
}

export const HealthScore = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center min-h-[160px] animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-24 mb-4"></div>
        <div className="h-12 bg-gray-50 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-100 rounded w-12"></div>
      </div>
    );
  }

  const scoreData = data || { score: 0, status: "CRITICAL" as const };

  let scoreColor = "text-green-500";
  if (scoreData.status === "CRITICAL") scoreColor = "text-red-500";
  else if (scoreData.status === "WARNING") scoreColor = "text-yellow-500";

  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center min-h-[160px]">
      <h3 className="text-gray-500 font-medium mb-2">Inventory Health</h3>
      <div className={`text-6xl font-black ${scoreColor}`}>
        {scoreData.score}
      </div>
      <div className={`mt-2 font-bold tracking-widest text-sm ${scoreColor}`}>
        {scoreData.status}
      </div>
    </div>
  );
};
