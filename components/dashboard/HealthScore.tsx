import { InventoryHealth } from "@/types/analytics.types";
import { Activity } from "lucide-react";

interface Props {
  data?: InventoryHealth;
  isLoading?: boolean;
}

export const HealthScore = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-full animate-pulse min-h-[140px]">
        <div className="h-4 bg-slate-100 rounded w-24 mb-4"></div>
        <div className="h-12 bg-slate-50 rounded w-16 mb-2"></div>
      </div>
    );
  }

  const scoreData = data || { score: 0, status: "CRITICAL" as const };

  let scoreColor = "text-emerald-500";
  let bgColor = "bg-emerald-50";
  let borderColor = "border-emerald-100";

  if (scoreData.status === "CRITICAL") {
    scoreColor = "text-rose-500";
    bgColor = "bg-rose-50";
    borderColor = "border-rose-100";
  } else if (scoreData.status === "WARNING") {
    scoreColor = "text-amber-500";
    bgColor = "bg-amber-50";
    borderColor = "border-amber-100";
  }

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${borderColor} flex flex-col items-center justify-center h-full relative overflow-hidden group hover:shadow-md transition-shadow min-h-[140px]`}>
      <div className="absolute top-4 left-4">
         <Activity size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none text-center">System Health</p>
      <div className={`text-6xl font-black ${scoreColor} tracking-tighter`}>
        {scoreData.score}
      </div>
      <div className={`mt-2 font-black tracking-[0.2em] text-[10px] uppercase px-3 py-1 rounded-full ${bgColor} ${scoreColor}`}>
        {scoreData.status}
      </div>
    </div>
  );
};

