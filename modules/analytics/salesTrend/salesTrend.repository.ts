import { prisma } from "@/lib/db/prisma";
import { Prisma, PrismaClient } from "@prisma/client";

type DbClient = Prisma.TransactionClient | PrismaClient;

export const salesTrendRepository = {
  async upsertDailySales(date: Date, revenueIncrement: number, unitsIncrement: number, tx: DbClient = prisma) {
    return tx.dailySales.upsert({
      where: { date },
      update: {
        revenue: { increment: revenueIncrement },
        unitsSold: { increment: unitsIncrement },
      },
      create: {
        date,
        revenue: revenueIncrement,
        unitsSold: unitsIncrement,
      },
    });
  },

  async getTotalRevenue(tx: DbClient = prisma): Promise<number> {
    const result = await tx.dailySales.aggregate({ _sum: { revenue: true } });
    return result._sum.revenue || 0;
  },

  async getTotalUnitsSold(tx: DbClient = prisma): Promise<number> {
    const result = await tx.dailySales.aggregate({ _sum: { unitsSold: true } });
    return result._sum.unitsSold || 0;
  },

  async getSalesTrend(startDate: Date, endDate: Date, tx: DbClient = prisma) {
    return tx.dailySales.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        revenue: true,
        unitsSold: true,
      },
      orderBy: {
        date: "asc",
      },
    });
  },
};
