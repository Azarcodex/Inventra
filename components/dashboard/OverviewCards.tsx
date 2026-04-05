import { AnalyticsOverview } from "@/types/analytics.types";
import { DollarSign, ShoppingBag, AlertTriangle, XCircle, TrendingUp } from "lucide-react";

interface Props {
  data?: AnalyticsOverview;
  isLoading?: boolean;
}

export const OverviewCards = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-1/3 mb-4"></div>
            <div className="h-10 bg-slate-50 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = data || {
    totalRevenue: 0,
    totalUnitsSold: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  };

  const kpis = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      label: "Gross Sales",
      icon: DollarSign,
      color: "bg-indigo-50",
      iconColor: "text-indigo-600",
      accent: "border-indigo-100"
    },
    {
      title: "Units Sold",
      value: stats.totalUnitsSold.toLocaleString(),
      label: "Total Inventory Out",
      icon: ShoppingBag,
      color: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "border-emerald-100"
    },
    {
      title: "Low Stock",
      value: stats.lowStockCount.toString(),
      label: "Requires Attention",
      icon: AlertTriangle,
      color: "bg-amber-50",
      iconColor: "text-amber-600",
      accent: "border-amber-100"
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockCount.toString(),
      label: "Active Stockouts",
      icon: XCircle,
      color: "bg-rose-50",
      iconColor: "text-rose-600",
      accent: "border-rose-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className={`bg-white p-4 md:p-6 rounded-2xl shadow-sm border ${kpi.accent} hover:shadow-md transition-shadow group flex flex-col justify-between`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 leading-none">{kpi.title}</p>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{kpi.value}</h3>
              </div>
              <div className={`${kpi.color} p-2 md:p-2.5 rounded-xl ${kpi.iconColor} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-4 md:mt-6 pt-4 border-t border-slate-50 flex items-center gap-1.5">
               <TrendingUp size={12} className={kpi.iconColor} />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

