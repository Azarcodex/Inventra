export enum StockStatus {
  IN_STOCK = "IN_STOCK",
  LOW_STOCK = "LOW_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export type MovementType = "SALE" | "PURCHASE" | "ADJUSTMENT";

export interface StockMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  createdAt: string;
}
