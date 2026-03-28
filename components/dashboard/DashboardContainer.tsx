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

export const DashboardContainer = () => {
  const { data: overview, isLoading: loadingOverview } = useAnalyticsOverview();
  const { data: salesTrend, isLoading: loadingSalesTrend } = useSalesTrend("7d");
  const { data: topProducts, isLoading: loadingTopProducts } = useTopProducts();
  const { data: lowStock, isLoading: loadingLowStock } = useLowStock();
  const { data: deadStock, isLoading: loadingDeadStock } = useDeadStock();
  const { data: stockoutRisk, isLoading: loadingStockoutRisk } = useStockoutRisk();
  const { data: restock, isLoading: loadingRestock } = useRestock();
  const { data: healthScore, isLoading: loadingHealthScore } = useHealthScore();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <OverviewCards data={overview} isLoading={loadingOverview} />
        </div>
        <div className="w-full lg:w-1/4">
          <HealthScore data={healthScore} isLoading={loadingHealthScore} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
        <SalesTrend data={salesTrend} isLoading={loadingSalesTrend} />
        <TopProducts data={topProducts} isLoading={loadingTopProducts} />
        <StockoutRisk data={stockoutRisk} isLoading={loadingStockoutRisk} />
        <RestockSuggestions data={restock} isLoading={loadingRestock} />
        <LowStockList data={lowStock} isLoading={loadingLowStock} />
        <DeadStockList data={deadStock} isLoading={loadingDeadStock} />
      </div>
    </div>
  );
};
