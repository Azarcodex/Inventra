import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { InventoryHealth } from "@/types/analytics.types";

export const useHealthScore = () => {
  return useQuery({
    queryKey: ["analytics", "healthScore"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: InventoryHealth }>("/analytics/health-score");
      return response.data.data;
    },
  });
};
