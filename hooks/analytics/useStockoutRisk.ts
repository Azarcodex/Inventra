import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { StockoutRisk } from "@/types/analytics.types";

export const useStockoutRisk = () => {
  return useQuery({
    queryKey: ["analytics", "stockoutRisk"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: StockoutRisk[] }>("/analytics/stockout-risk");
      return response.data.data;
    },
  });
};
