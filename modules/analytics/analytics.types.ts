export interface AnalyticsOverview {
  totalRevenue: number;
  totalUnitsSold: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export type SalesTrendPoint = {
  date: string;        // ISO date string (YYYY-MM-DD)
  revenue: number;
  unitsSold: number;
};

export type DeadStockProduct = {
  productId: string;
  name: string;
  stock: number;
  daysSinceLastSale: number;
};

export type StockoutRisk = {
  productId: string;
  name: string;
  stock: number;
  avgDailySales: number;
  daysRemaining: number | null;
  riskLevel: "HIGH" | "MEDIUM" | "SAFE";
};

export type RestockRecommendation = {
  productId: string;
  name: string;
  currentStock: number;
  avgDailySales: number;
  recommendedRestock: number;
};

export type ProductClassification = {
  productId: string;
  name: string;
  stock: number;
  avgDailySales: number;
  category: "FAST" | "SLOW" | "DEAD";
};

export type InventoryHealth = {
  score: number;
  status: "GOOD" | "WARNING" | "CRITICAL";
};
