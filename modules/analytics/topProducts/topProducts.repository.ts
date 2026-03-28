import { prisma } from "@/lib/db/prisma";
import { Prisma, PrismaClient } from "@prisma/client";

type DbClient = Prisma.TransactionClient | PrismaClient;

export const topProductsRepository = {
  async upsertProductStats(productId: string, soldIncrement: number = 0, purchasedIncrement: number = 0, tx: DbClient = prisma) {
    return tx.productStats.upsert({
      where: { productId },
      update: {
        totalSold: { increment: soldIncrement },
        totalPurchased: { increment: purchasedIncrement },
      },
      create: {
        productId,
        totalSold: soldIncrement,
        totalPurchased: purchasedIncrement,
      },
    });
  },

  async getProductPrice(productId: string, tx: DbClient = prisma): Promise<number | null> {
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: { price: true },
    });
    return product?.price ?? null;
  },
};
