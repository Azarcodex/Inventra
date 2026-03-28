import { StockStatus } from "@/modules/stock/stock.types";

export function calculateStockStatus(
  stock: number,
  bufferStock: number | null,
): StockStatus {
  if (stock === 0) return StockStatus.OUT_OF_STOCK;

  if (bufferStock !== null && stock <= bufferStock) {
    return StockStatus.LOW_STOCK;
  }

  return StockStatus.IN_STOCK;
}
