import { apiClient } from "./client";
import { CreateStockMovementInput } from "@/modules/stock/stock.validator";
import { StockMovement } from "@/modules/stock/stock.types";

export const stockMovementApi = {
  create: async (data: CreateStockMovementInput): Promise<StockMovement> => {
    const res = await apiClient.post("/stock/movement", data);
    return res.data.data;
  },

  getAllByProductId: async (productId: string): Promise<StockMovement[]> => {
    const res = await apiClient.get("/stock/movement", {
      params: { productId },
    });
    return res.data.data;
  },
};
