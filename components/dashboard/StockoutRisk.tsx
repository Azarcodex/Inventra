import { StockoutRisk as StockoutRiskType } from "@/types/analytics.types";
import { AlertCircle } from "lucide-react";

interface Props {
  data?: StockoutRiskType[];
  isLoading?: boolean;
}

export const StockoutRisk = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse h-[400px]">
        <div className="h-6 bg-slate-100 rounded w-40 mb-8"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  // Separate actual risks from the rest
  const risks = data?.filter((r) => r.riskLevel !== "SAFE") || [];
  
  // If no immediate risks, show the "Next to run out" watchlist
  const watchlist = data
    ?.filter((r) => r.riskLevel === "SAFE" && r.daysRemaining !== null)
    .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
    .slice(0, 5) || [];

  const displayList = risks.length > 0 ? risks : watchlist;
  const isHealthy = risks.length === 0;

  if (displayList.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-[400px] text-slate-400 text-center">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Continuity</h3>
        <p className="text-sm font-medium">No sales data to calculate continuity risks.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Continuity</p>
        
        {isHealthy ? (
          <div>
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2 text-slate-900">
               Stockout Risk
               <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                 0 Risks
               </span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 mt-2">No immediate risks. Upcoming watchlist based on run-rate:</p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-black text-rose-600 tracking-tight flex items-center gap-2">
               Action Required
            </h3>
            <p className="text-[11px] font-medium text-slate-500 mt-2">Products at high or medium risk of stockout.</p>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {displayList.map((risk) => {
          let riskColor = "text-emerald-500 bg-emerald-50 border-emerald-100";
          if (risk.riskLevel === "HIGH") riskColor = "text-rose-500 bg-rose-50 border-rose-100";
          else if (risk.riskLevel === "MEDIUM") riskColor = "text-amber-500 bg-amber-50 border-amber-100";

          return (
            <div key={risk.productId} className="flex justify-between items-center p-3 rounded-xl border border-slate-50 bg-slate-50/30 group hover:bg-white hover:border-slate-200 transition-all">
              <div className="flex flex-col min-w-0">
                 <span className="text-sm font-bold text-slate-900 truncate">{risk.name}</span>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   {risk.daysRemaining !== null ? `${Math.round(risk.daysRemaining)} days left` : "Out of Stock"}
                 </span>
              </div>
              <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${riskColor} flex items-center gap-1 shrink-0`}>
                <AlertCircle size={10} />
                {risk.riskLevel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

