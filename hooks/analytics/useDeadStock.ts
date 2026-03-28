import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { DeadStockProduct } from "@/types/analytics.types";

export const useDeadStock = (days: number = 30) => {
  return useQuery({
    queryKey: ["analytics", "deadStock", days],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DeadStockProduct[] }>(`/analytics/dead-stock?days=${days}`);
      return response.data.data;
    },
  });
};
