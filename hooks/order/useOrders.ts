import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export const useOrders = (page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: async () => {
      const response = await apiClient.get(
        `/orders?page=${page}&limit=${limit}`
      );
      return response.data;
    },
  });
};
