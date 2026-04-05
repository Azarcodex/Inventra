import { RestockRecommendation } from "@/types/analytics.types";
import { Sparkles, Plus } from "lucide-react";

interface Props {
  data?: RestockRecommendation[];
  isLoading?: boolean;
}

export const RestockSuggestions = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse h-[400px]">
        <div className="h-6 bg-slate-100 rounded w-44 mb-8"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  // Separate actionable restocks from the rest
  const actionable = data?.filter((r) => r.recommendedRestock > 0) || [];
  
  // If no immediate actions needed, show the top selling items
  const trending = data
    ?.filter((r) => r.recommendedRestock === 0 && r.avgDailySales > 0)
    .sort((a, b) => b.avgDailySales - a.avgDailySales)
    .slice(0, 5) || [];

  const displayList = actionable.length > 0 ? actionable : trending;
  const isHealthy = actionable.length === 0;

  if (displayList.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-[400px] text-slate-400 text-center">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Optimization</h3>
        <p className="text-sm font-medium">Not enough sales data to generate restock recommendations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Optimization</p>
          {isHealthy ? (
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                 Restock
                 <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                   Optimized
                 </span>
              </h3>
              <p className="text-[11px] font-medium text-slate-500 mt-2">Inventory levels are sufficient. Top trending products:</p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                 Restock Suggestions
              </h3>
              <p className="text-[11px] font-medium text-slate-500 mt-2">Items recommended for reorder based on run-rate.</p>
            </div>
          )}
        </div>
        <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg shrink-0">
           <Sparkles size={14} />
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {displayList.map((item) => (
          <div key={item.productId} className="flex justify-between items-center p-3 rounded-xl border border-slate-50 bg-slate-50/30 group hover:bg-white hover:border-slate-200 transition-all">
            <div className="flex flex-col min-w-0">
               <span className="text-sm font-bold text-slate-900 truncate">{item.name}</span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 {isHealthy 
                   ? `${item.avgDailySales.toFixed(1)} sales/day` 
                   : `Target: +${item.recommendedRestock}`
                 }
               </span>
            </div>
            {isHealthy ? (
               <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm border border-emerald-100">
                 Good
               </div>
            ) : (
               <div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1 shrink-0">
                 <Plus size={10} />
                 Add
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

