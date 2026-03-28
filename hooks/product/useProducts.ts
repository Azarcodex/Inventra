import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Product } from "@/types/pos.types";

interface ProductsResponse {
  message: string;
  products: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const useProducts = (page: number = 1, limit: number = 10, search: string = "") => {
  return useQuery({
    queryKey: ["products", "list", page, limit, search],
    queryFn: async () => {
      const response = await apiClient.get<ProductsResponse>(
        `/products?page=${page}&limit=${limit}&search=${search}`
      );
      return response.data;
    },
  });
};
