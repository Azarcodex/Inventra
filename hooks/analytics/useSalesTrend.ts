import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { SalesTrendPoint } from "@/types/analytics.types";

export const useSalesTrend = (range: string = "7d") => {
  return useQuery({
    queryKey: ["analytics", "salesTrend", range],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: SalesTrendPoint[] }>(`/analytics/sales-trend?range=${range}`);
      return response.data.data;
    },
  });
};
