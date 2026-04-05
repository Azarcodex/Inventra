import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { SupplierInput } from "@/modules/supplier/supplier.validator";

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SupplierInput) => {
      const response = await apiClient.post("/suppliers", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};
