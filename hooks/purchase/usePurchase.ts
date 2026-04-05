import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export const usePurchase = (id: string) => {
  return useQuery({
    queryKey: ["purchase", id],
    queryFn: async () => {
      const response = await apiClient.get(`/purchases/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};
