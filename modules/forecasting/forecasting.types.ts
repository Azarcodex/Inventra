export interface ForecastMetric {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  leadTime: number;
  bufferStock: number;
  velocity: number; // units per day (30-day avg)
  reorderPoint: number;
  daysUntilZero: number;
  suggestedOrderQuantity: number;
  status: "OUT_OF_STOCK" | "CRITICAL" | "REORDER_NOW" | "HEALTHY";
}
