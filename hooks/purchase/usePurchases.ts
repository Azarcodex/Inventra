import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export const usePurchases = () => {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const response = await apiClient.get("/purchases");
      // Standardize response extraction if it's wrapped in { success, data }
      return response.data.data;
    },
  });
};
