import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.patch(`/suppliers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier profile synchronized.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Logistics update failed.");
    },
  });
};
