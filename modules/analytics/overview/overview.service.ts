import { salesTrendService } from "../salesTrend/salesTrend.service";
import { lowStockService } from "../lowStock/lowStock.service";
import { topProductsService } from "../topProducts/topProducts.service";
import { AnalyticsOverview } from "../analytics.types";
import { AnalyticsMovementEvent, analyticsMovementEventSchema } from "../analytics.validator";
import { Prisma } from "@prisma/client";

export const overviewService = {
  async getOverview(): Promise<AnalyticsOverview> {
    const [totals, counts] = await Promise.all([
      salesTrendService.getTotals(),
      lowStockService.getCounts(),
    ]);

    return {
      totalRevenue: totals.totalRevenue,
      totalUnitsSold: totals.totalUnitsSold,
      lowStockCount: counts.lowStockCount,
      outOfStockCount: counts.outOfStockCount,
    };
  },

  // Orchestrates the analytics updates triggered by stock movements
  async updateFromMovement(movement: AnalyticsMovementEvent, tx: Prisma.TransactionClient) {
    const validated = analyticsMovementEventSchema.parse(movement);
    const { productId, type, quantity } = validated;

    if (type === "SALE") {
      let targetPrice = validated.price;
      
      if (targetPrice == null) {
        const fetchedPrice = await topProductsService.getProductPrice(productId, tx);
        
        if (fetchedPrice == null) {
          throw new Error(`Price is required for SALE analytics on product: ${productId}`);
        }
        targetPrice = fetchedPrice;
      }

      await salesTrendService.recordSale(quantity, targetPrice, tx);
      await topProductsService.recordSale(productId, quantity, tx);

    } else if (type === "PURCHASE") {
      await topProductsService.recordPurchase(productId, quantity, tx);
    }
  }
};
