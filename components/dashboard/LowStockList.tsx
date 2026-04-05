import { LowStockProduct } from "@/types/analytics.types";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  data?: LowStockProduct[];
  isLoading?: boolean;
}

export const LowStockList = ({ data, isLoading }: Props) => {
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
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-[400px] text-slate-400">
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full mb-4">
           <AlertTriangle size={24} />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Inventory Health</h3>
        <p className="text-sm font-medium">All stocks are currently healthy.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Alerts</p>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Low Stock</h3>
        </div>
        <Link href="/inventory" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
           View All <ArrowRight size={10} />
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {data.map((product) => (
          <div key={product.productId} className="flex justify-between items-center p-3 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200 transition-all group">
            <div className="flex flex-col min-w-0">
               <span className="text-sm font-bold text-slate-900 truncate">{product.name}</span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock: {product.stock}</span>
            </div>
            <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">
              Critical
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

