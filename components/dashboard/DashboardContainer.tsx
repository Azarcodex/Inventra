"use client";

import { useAnalyticsOverview } from "@/hooks/analytics/useAnalyticsOverview";
import { useSalesTrend } from "@/hooks/analytics/useSalesTrend";
import { useTopProducts } from "@/hooks/analytics/useTopProducts";
import { useLowStock } from "@/hooks/analytics/useLowStock";
import { useDeadStock } from "@/hooks/analytics/useDeadStock";
import { useStockoutRisk } from "@/hooks/analytics/useStockoutRisk";
import { useRestock } from "@/hooks/analytics/useRestock";
import { useHealthScore } from "@/hooks/analytics/useHealthScore";

import { OverviewCards } from "./OverviewCards";
import { SalesTrend } from "./SalesTrend";
import { TopProducts } from "./TopProducts";
import { LowStockList } from "./LowStockList";
import { DeadStockList } from "./DeadStockList";
import { StockoutRisk } from "./StockoutRisk";
import { RestockSuggestions } from "./RestockSuggestions";
import { HealthScore } from "./HealthScore";
import { Calendar, RefreshCw } from "lucide-react";

export const DashboardContainer = () => {
  const { data: overview, isLoading: loadingOverview, refetch } = useAnalyticsOverview();
  const { data: salesTrend, isLoading: loadingSalesTrend } = useSalesTrend("7d");
  const { data: topProducts, isLoading: loadingTopProducts } = useTopProducts();
  const { data: lowStock, isLoading: loadingLowStock } = useLowStock();
  const { data: deadStock, isLoading: loadingDeadStock } = useDeadStock();
  const { data: stockoutRisk, isLoading: loadingStockoutRisk } = useStockoutRisk();
  const { data: restock, isLoading: loadingRestock } = useRestock();
  const { data: healthScore, isLoading: loadingHealthScore } = useHealthScore();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-700">
      {/* 🛠️ Dashboard Header / Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Business Overview</h2>
          <p className="text-xs md:text-sm font-medium text-slate-500">Real-time performance tracking and inventory health.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold text-slate-600 shadow-sm whitespace-nowrap">
              <Calendar size={14} /> Last 7 Days
           </div>
           <button 
             onClick={() => refetch()}
             className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
           >
              <RefreshCw size={18} className={loadingOverview ? "animate-spin" : ""} />
           </button>
        </div>
      </div>

      {/* 🚀 Row 1: Key Performance Indicators & Health */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="w-full xl:flex-3">
          <OverviewCards data={overview} isLoading={loadingOverview} />
        </div>
        <div className="w-full xl:flex-1 xl:min-w-[320px]">
          <HealthScore data={healthScore} isLoading={loadingHealthScore} />
        </div>
      </div>

      {/* 📊 Row 2: Performance Visualization */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SalesTrend data={salesTrend} isLoading={loadingSalesTrend} />
        </div>
        <div className="w-full">
          <TopProducts data={topProducts} isLoading={loadingTopProducts} />
        </div>
      </div>

      {/* ⚠️ Row 3: Actionable Alerts & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <LowStockList data={lowStock} isLoading={loadingLowStock} />
        <StockoutRisk data={stockoutRisk} isLoading={loadingStockoutRisk} />
        <RestockSuggestions data={restock} isLoading={loadingRestock} />
        <DeadStockList data={deadStock} isLoading={loadingDeadStock} />
      </div>
    </div>
  );
};

