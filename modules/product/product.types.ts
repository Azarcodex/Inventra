import { StockStatus } from "@/modules/stock/stock.types";

/**
 * Clean domain model for Products.
 * Includes status calculated via business logic.
 * Used for both API responses and UI display.
 */
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  lastCostPrice: number;
  taxRate: number;
  stock: number;
  leadTime: number;
  bufferStock: number;
  preferredSupplierId?: string | null;
  status: StockStatus;
  createdAt: string | Date; // Date from Prisma, but string when traveling via JSON
  updatedAt: string | Date;
}
