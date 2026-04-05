import { prisma } from "@/lib/db/prisma";
import { MovementType } from "@prisma/client";

export const forecastingRepository = {
  async getProductsWithRecentSales(daysStr: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysStr);

    // Fetch all non-deleted products along with their sales movements within the cutoff
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        leadTime: true,
        bufferStock: true,
        movements: {
          where: {
            type: MovementType.SALE,
            createdAt: { gte: cutoffDate },
          },
          select: { quantity: true },
        },
      },
    });

    return products;
  },
};
