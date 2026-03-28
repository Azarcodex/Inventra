import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stockMovementApi } from "@/lib/api/stockMovement.api";
import { CreateStockMovementInput } from "@/modules/stock/stock.validator";

export const useStockMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStockMovementInput) => stockMovementApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};
