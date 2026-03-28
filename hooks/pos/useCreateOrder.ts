import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { CreateOrderInput } from "@/types/pos.types";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderInput) => {
      const response = await apiClient.post("/orders", orderData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate products and analytics queries to reflect stock changes
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};
