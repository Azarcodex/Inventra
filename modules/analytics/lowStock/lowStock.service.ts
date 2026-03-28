import { lowStockRepository } from "./lowStock.repository";
import { DeadStockProduct, StockoutRisk, RestockRecommendation, ProductClassification, InventoryHealth } from "../analytics.types";

export const lowStockService = {
  async getCounts() {
    const [lowStockCount, outOfStockCount] = await Promise.all([
      lowStockRepository.getLowStockCount(),
      lowStockRepository.getOutOfStockCount(),
    ]);

    return { lowStockCount, outOfStockCount };
  },

  async getDeadStockProducts(days: number = 30): Promise<DeadStockProduct[]> {
    const today = new Date();
    const thresholdDate = new Date(today);
    thresholdDate.setDate(today.getDate() - days);

    const products = await lowStockRepository.getProductsWithLastSale();

    const deadStock: DeadStockProduct[] = [];

    for (const p of products) {
      if (p.stock > 0) {
        if (!p.lastSaleDate || p.lastSaleDate < thresholdDate) {
          let daysSince = days; // Default for no sale
          
          if (p.lastSaleDate) {
            const diffTime = Math.abs(today.getTime() - p.lastSaleDate.getTime());
            daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          }

          deadStock.push({
            productId: p.productId,
            name: p.name,
            stock: p.stock,
            daysSinceLastSale: daysSince,
          });
        }
      }
    }

    return deadStock;
  },

  async getStockoutRisk(days: number = 7): Promise<StockoutRisk[]> {
    const products = await lowStockRepository.getProductSalesLastNDays(days);

    return products.map((p) => {
      const avgDailySales = p.totalSold / days;
      let daysRemaining: number | null = null;

      if (p.stock === 0) {
        daysRemaining = 0;
      } else if (avgDailySales > 0) {
        daysRemaining = p.stock / avgDailySales;
      }

      let riskLevel: "HIGH" | "MEDIUM" | "SAFE";
      if (p.stock === 0) {
        riskLevel = "HIGH";
      } else if (avgDailySales === 0 || daysRemaining === null) {
        riskLevel = "SAFE";
      } else if (daysRemaining <= 3) {
        riskLevel = "HIGH";
      } else if (daysRemaining <= 7) {
        riskLevel = "MEDIUM";
      } else {
        riskLevel = "SAFE";
      }

      return {
        productId: p.productId,
        name: p.name,
        stock: p.stock,
        avgDailySales: Number(avgDailySales.toFixed(2)),
        daysRemaining: daysRemaining !== null ? Number(daysRemaining.toFixed(2)) : null,
        riskLevel,
      };
    });
  },

  async getRestockRecommendations(days: number = 7): Promise<RestockRecommendation[]> {
    const stockoutRisks = await this.getStockoutRisk(days);

    return stockoutRisks.map((risk) => {
      let recommendedRestock = risk.avgDailySales * days;

      if (risk.avgDailySales === 0) {
        recommendedRestock = 0;
      } else if (risk.stock >= recommendedRestock) {
        recommendedRestock = 0;
      } else {
        // Option 1: recommendedRestock = Math.ceil(recommendedRestock) (as per prompt exact text: avgDailySales * days)
        // Mathematically, to reach target, you reorder (target - stock). Since the prompt prioritized "simplicity and correctness" 
        // and explicitly wrote `recommendedRestock = avgDailySales * days`, I'll apply exactly that and round it.
        recommendedRestock = Math.ceil(recommendedRestock);
      }

      return {
        productId: risk.productId,
        name: risk.name,
        currentStock: risk.stock,
        avgDailySales: risk.avgDailySales,
        recommendedRestock,
      };
    });
  },

  async getProductClassification(): Promise<ProductClassification[]> {
    // Determine average daily sales (last 30 days) and fetch dead stock list concurrently.
    const [stockoutRisks, deadStocks] = await Promise.all([
      this.getStockoutRisk(30),
      this.getDeadStockProducts(30),
    ]);

    const deadProductIds = new Set(deadStocks.map((p) => p.productId));

    return stockoutRisks.map((risk) => {
      let category: "FAST" | "SLOW" | "DEAD";

      if (deadProductIds.has(risk.productId)) {
        category = "DEAD";
      } else if (risk.avgDailySales >= 5) {
        category = "FAST";
      } else {
        category = "SLOW";
      }

      return {
        productId: risk.productId,
        name: risk.name,
        stock: risk.stock,
        avgDailySales: risk.avgDailySales,
        category,
      };
    });
  },

  async getInventoryHealth(): Promise<InventoryHealth> {
    const [stockoutRisks, deadStocks] = await Promise.all([
      this.getStockoutRisk(30),
      this.getDeadStockProducts(30),
    ]);

    const totalProducts = stockoutRisks.length;

    if (totalProducts === 0) {
      return { score: 100, status: "GOOD" };
    }

    const deadStockCount = deadStocks.length;
    const highRiskCount = stockoutRisks.filter(r => r.daysRemaining !== null && r.daysRemaining <= 3).length;

    let score = 100;
    
    score -= (deadStockCount / totalProducts) * 40;
    score -= (highRiskCount / totalProducts) * 30;

    score = Math.max(0, Math.min(100, Math.round(score)));

    let status: "GOOD" | "WARNING" | "CRITICAL";
    if (score >= 80) status = "GOOD";
    else if (score >= 50) status = "WARNING";
    else status = "CRITICAL";

    return { score, status };
  },
};
