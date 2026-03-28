import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { LowStockProduct } from "@/types/analytics.types";

export const useLowStock = () => {
  return useQuery({
    queryKey: ["analytics", "lowStock"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: LowStockProduct[] }>("/analytics/low-stock");
      return response.data.data;
    },
  });
};
