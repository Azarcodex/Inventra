import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Product } from "@/types/pos.types";

export const useProductsSearch = (search: string) => {
  return useQuery({
    queryKey: ["products", "search", search],
    queryFn: async () => {
      const response = await apiClient.get<{ products: Product[] }>(
        `/products?search=${search}`
      );
      return response.data.products || [];
    },
    enabled: true, // Always allow search, even if empty (returns all) or relies on debounce logic in component
  });
};
