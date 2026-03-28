import { prisma } from "@/lib/db/prisma";
import { Prisma, PrismaClient } from "@prisma/client";

type DbClient = Prisma.TransactionClient | PrismaClient;

const LOW_STOCK_THRESHOLD = 10;

export const lowStockRepository = {
  async getLowStockCount(tx: DbClient = prisma): Promise<number> {
    return tx.product.count({
      where: { stock: { gt: 0, lte: LOW_STOCK_THRESHOLD }, deletedAt: null },
    });
  },

  async getOutOfStockCount(tx: DbClient = prisma): Promise<number> {
    return tx.product.count({
      where: { stock: 0, deletedAt: null },
    });
  },

  async getProductsWithLastSale(tx: DbClient = prisma) {
    const products = await tx.product.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        stock: true,
      },
    });

    const lastSales = await tx.stockMovement.groupBy({
      by: ["productId"],
      where: {
        type: "SALE",
      },
      _max: {
        createdAt: true,
      },
    });

    const lastSaleMap = new Map<string, Date>();
    for (const sale of lastSales) {
      if (sale._max.createdAt) {
        lastSaleMap.set(sale.productId, sale._max.createdAt);
      }
    }

    return products.map((p) => ({
      productId: p.id,
      name: p.name,
      stock: p.stock,
      lastSaleDate: lastSaleMap.get(p.id) || null,
    }));
  },

  async getProductSalesLastNDays(days: number, tx: DbClient = prisma) {
    const today = new Date();
    const thresholdDate = new Date(today);
    thresholdDate.setDate(today.getDate() - days);

    // Fetch active products
    const products = await tx.product.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        stock: true,
      },
    });

    // Fetch sales aggregation
    const salesAgr = await tx.stockMovement.groupBy({
      by: ["productId"],
      where: {
        type: "SALE",
        createdAt: {
          gte: thresholdDate,
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const salesMap = new Map<string, number>();
    for (const sale of salesAgr) {
      if (sale._sum.quantity) {
        salesMap.set(sale.productId, sale._sum.quantity);
      }
    }

    return products.map((p) => ({
      productId: p.id,
      name: p.name,
      stock: p.stock,
      totalSold: salesMap.get(p.id) || 0,
    }));
  },
};
