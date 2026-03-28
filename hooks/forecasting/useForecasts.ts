import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export interface ForecastMetric {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  leadTime: number;
  bufferStock: number;
  velocity: number;
  reorderPoint: number;
  daysUntilZero: number;
  suggestedOrderQuantity: number;
  status: "OUT_OF_STOCK" | "CRITICAL" | "REORDER_NOW" | "HEALTHY";
}

export const useForecasts = (days: number = 30) => {
  return useQuery({
    queryKey: ["forecasts", days],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: ForecastMetric[] }>(`/forecasting?days=${days}`);
      return response.data.data;
    },
  });
};
