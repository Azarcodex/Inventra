import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/lib/api/product.api";
import { CreateProductInput } from "@/modules/product/product.validator";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
};
