import { DeadStockProduct } from "@/types/analytics.types";
import { Clock } from "lucide-react";

interface Props {
  data?: DeadStockProduct[];
  isLoading?: boolean;
}

export const DeadStockList = ({ data, isLoading }: Props) => {
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

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-[400px] text-slate-400 text-center">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Inventory Efficiency</h3>
        <p className="text-sm font-medium">No dead stock detected.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Efficiency</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Dead Stock</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {data.map((product) => (
          <div key={product.productId} className="flex justify-between items-center p-3 rounded-xl border border-slate-50 bg-slate-50/30 group hover:bg-white hover:border-slate-200 transition-all">
            <div className="flex flex-col min-w-0">
               <span className="text-sm font-bold text-slate-900 truncate">{product.name}</span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty: {product.stock}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase shrink-0">
               <Clock size={12} className="text-slate-300" />
               {product.daysSinceLastSale}d
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

