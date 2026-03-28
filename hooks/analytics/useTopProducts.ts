import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { TopProduct } from "@/types/analytics.types";

export const useTopProducts = () => {
  return useQuery({
    queryKey: ["analytics", "topProducts"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: TopProduct[] }>("/analytics/top-products");
      return response.data.data;
    },
  });
};
