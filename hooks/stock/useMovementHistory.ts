import { useQuery } from "@tanstack/react-query";
import { stockMovementApi } from "@/lib/api/stockMovement.api";

export const useMovementHistory = (productId: string | null) => {
  return useQuery({
    queryKey: ["movements", productId],
    queryFn: () => (productId ? stockMovementApi.getAllByProductId(productId) : []),
    enabled: !!productId,
  });
};
