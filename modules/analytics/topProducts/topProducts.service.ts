import { topProductsRepository } from "./topProducts.repository";
import { Prisma } from "@prisma/client";

export const topProductsService = {
  async recordSale(productId: string, quantity: number, tx: Prisma.TransactionClient) {
    await topProductsRepository.upsertProductStats(productId, quantity, 0, tx);
  },

  async recordPurchase(productId: string, quantity: number, tx: Prisma.TransactionClient) {
    await topProductsRepository.upsertProductStats(productId, 0, quantity, tx);
  },

  async getProductPrice(productId: string, tx: Prisma.TransactionClient) {
    return topProductsRepository.getProductPrice(productId, tx);
  },
};
