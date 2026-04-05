import { purchaseRepository } from "./purchase.repository";
import { PurchaseInput } from "./purchase.validator";

export const purchaseService = {
  async getAllPurchases() {
    return purchaseRepository.getAll();
  },

  async getPurchaseById(id: string) {
    return purchaseRepository.getById(id);
  },

  async recordPurchase(input: PurchaseInput) {
    // Business logic like credit limit checks or PO number formatting could go here
    return purchaseRepository.createWithStockUpdates(input);
  }
};
