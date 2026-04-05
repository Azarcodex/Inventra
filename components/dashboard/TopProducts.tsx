import { TopProduct } from "@/types/analytics.types";

interface Props {
  data?: TopProduct[];
  isLoading?: boolean;
}

export const TopProducts = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse h-[400px]">
        <div className="h-6 bg-slate-100 rounded w-40 mb-8"></div>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-2 bg-slate-50 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-[400px] text-slate-400">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 self-start">Leaderboard</h3>
        <p className="text-sm font-medium">No sales data available yet.</p>
      </div>
    );
  }

  const maxSold = Math.max(...data.map(p => p.totalSold), 1);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Leaderboard</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Products</h3>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        {data.map((product, idx) => {
          const percentage = (product.totalSold / maxSold) * 100;
          return (
            <div key={product.productId} className="group">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-3">
                   <span className="text-xs font-black text-slate-300 group-hover:text-indigo-600 transition-colors">0{idx + 1}</span>
                   <span className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{product.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{product.totalSold} Units</span>
              </div>
              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000 group-hover:bg-indigo-500" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

