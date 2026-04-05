import { forecastingRepository } from "./forecasting.repository";
import { ForecastMetric } from "./forecasting.types";

export const forecastingService = {
  async generateForecasts(daysToAnalyze: number = 30): Promise<ForecastMetric[]> {
    const productsData = await forecastingRepository.getProductsWithRecentSales(daysToAnalyze);

    const forecasts = productsData.map((prod) => {
      // 1. Calculate historical sales
      const totalSold = prod.movements.reduce((sum, mov) => sum + mov.quantity, 0);
      
      // 2. Calculate daily velocity
      const velocity = totalSold / daysToAnalyze; // Average units/day
      
      // 3. Reorder Point (Lead Time Demand + Safety/Buffer Stock)
      // If velocity is 0, reorder point is just the buffer stock.
      const reorderPoint = Math.ceil((velocity * prod.leadTime) + prod.bufferStock);
      
      // 4. Days until stock hits zero
      const daysUntilZero = velocity > 0 ? Math.floor(prod.stock / velocity) : 999;
      
      // 5. Status logic
      let status: ForecastMetric["status"] = "HEALTHY";
      if (prod.stock <= 0) {
        status = "OUT_OF_STOCK";
      } else if (prod.stock <= prod.bufferStock && prod.bufferStock > 0) {
        status = "CRITICAL";
      } else if (prod.stock <= reorderPoint) {
        status = "REORDER_NOW";
      }

      // 6. Suggested Order Quantity (SOQ)
      // Formula: We want to order enough to bring us back to our Reorder Point PLUS an extra 30-day supply (runway).
      const shortfall = reorderPoint > prod.stock ? (reorderPoint - prod.stock) : 0;
      const runwayRefill = velocity * 30; // Aiming for 30 days of additional stock on hand
      let suggestedOrderQuantity = Math.ceil(shortfall + runwayRefill);
      
      if (suggestedOrderQuantity < 0 || isNaN(suggestedOrderQuantity)) {
        suggestedOrderQuantity = 0;
      }

      // If they haven't sold anything, we might not suggest ordering more unless they are below buffer.
      if (velocity === 0 && prod.stock < prod.bufferStock) {
        suggestedOrderQuantity = prod.bufferStock - prod.stock;
      }

      return {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        currentStock: prod.stock,
        leadTime: prod.leadTime,
        bufferStock: prod.bufferStock,
        velocity: Number(velocity.toFixed(2)),
        reorderPoint,
        daysUntilZero,
        suggestedOrderQuantity,
        status,
        preferredSupplier: prod.preferredSupplier,
      } as ForecastMetric;
    });

    // Sort by status priority: OUT_OF_STOCK(0) -> CRITICAL(1) -> REORDER_NOW(2) -> HEALTHY(3)
    const statusWeight = {
      OUT_OF_STOCK: 0,
      CRITICAL: 1,
      REORDER_NOW: 2,
      HEALTHY: 3,
    };
    
    return forecasts.sort((a, b) => {
      const wA = statusWeight[a.status];
      const wB = statusWeight[b.status];
      if (wA !== wB) return wA - wB;
      // If same status, sort by days until zero ascending
      return a.daysUntilZero - b.daysUntilZero;
    });
  },
};
