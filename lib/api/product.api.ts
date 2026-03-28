import { apiClient } from "./client";
import { Product } from "@/modules/product/product.types";
import { CreateProductInput } from "@/modules/product/product.validator";

export const productApi = {
  create: async (data: CreateProductInput): Promise<Product> => {
    const res = await apiClient.post("/products", data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<CreateProductInput>): Promise<Product> => {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  getAll: async (
    search: string = "",
    page: number = 1,
    limit: number = 10,
    sortBy: string = "createdAt",
    order: string = "desc",
  ): Promise<{ products: Product[]; pagination: any }> => {
    const res = await apiClient.get("/products", {
      params: { search, page, limit, sortBy, order },
    });

    return res.data;
  },
};
