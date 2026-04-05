import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Product } from "@/types/pos.types";

export const useProductsSearch = (search: string) => {
  return useQuery({
    queryKey: ["products", "search", search],
    queryFn: async () => {
      const response = await apiClient.get<{ products: Product[] }>(
        `/products?search=${search}&limit=100`
      );
      return response.data.products || [];
    },
    enabled: true,
  });
};

/**
 * Direct API lookup for a product by exact SKU.
 * Used by the POS scanner to find products that may not be in the current search results.
 */
export const lookupProductBySku = async (sku: string): Promise<Product | null> => {
  try {
    const response = await apiClient.get<{ products: Product[] }>(
      `/products?search=${encodeURIComponent(sku)}&limit=5`
    );
    const products = response.data.products || [];
    // Find an exact SKU match (case-insensitive)
    return products.find(
      (p) => p.sku.toUpperCase() === sku.toUpperCase()
    ) || null;
  } catch {
    return null;
  }
};

