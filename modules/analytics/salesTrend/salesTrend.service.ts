import { salesTrendRepository } from "./salesTrend.repository";
import { Prisma } from "@prisma/client";

import { SalesTrendPoint } from "../analytics.types";

function getStartOfDayUTC(date: Date): Date {
  const local = new Date(date);
  local.setHours(0, 0, 0, 0);
  return new Date(local.toISOString());
}

export const salesTrendService = {
  async recordSale(quantity: number, price: number, tx: Prisma.TransactionClient) {
    const today = getStartOfDayUTC(new Date());
    const revenueIncrement = quantity * price;
    await salesTrendRepository.upsertDailySales(today, revenueIncrement, quantity, tx);
  },

  async getTotals() {
    const [totalRevenue, totalUnitsSold] = await Promise.all([
      salesTrendRepository.getTotalRevenue(),
      salesTrendRepository.getTotalUnitsSold(),
    ]);

    return { totalRevenue, totalUnitsSold };
  },

  async getSalesTrend(range: "7d" | "30d" = "7d"): Promise<SalesTrendPoint[]> {
    const today = getStartOfDayUTC(new Date());
    const days = range === "30d" ? 30 : 7;
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days + 1);

    const rawData = await salesTrendRepository.getSalesTrend(startDate, today);

    const dataMap = new Map<string, { revenue: number; unitsSold: number }>();
    for (const item of rawData) {
      const dateStr = item.date.toISOString().split("T")[0];
      dataMap.set(dateStr, { revenue: item.revenue, unitsSold: item.unitsSold });
    }

    const result: SalesTrendPoint[] = [];
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split("T")[0];

      if (dataMap.has(dateStr)) {
        const existing = dataMap.get(dateStr)!;
        result.push({
          date: dateStr,
          revenue: existing.revenue,
          unitsSold: existing.unitsSold,
        });
      } else {
        result.push({
          date: dateStr,
          revenue: 0,
          unitsSold: 0,
        });
      }
    }

    return result;
  },
};
