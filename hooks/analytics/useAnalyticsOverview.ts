import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { AnalyticsOverview } from "@/types/analytics.types";

export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: AnalyticsOverview }>("/analytics/overview");
      return response.data.data;
    },
  });
};
