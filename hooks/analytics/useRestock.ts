import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { RestockRecommendation } from "@/types/analytics.types";

export const useRestock = () => {
  return useQuery({
    queryKey: ["analytics", "restock"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: RestockRecommendation[] }>("/analytics/restock");
      return response.data.data;
    },
  });
};
