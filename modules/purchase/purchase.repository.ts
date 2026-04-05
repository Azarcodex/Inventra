import { Prisma, MovementType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { PurchaseInput } from "./purchase.validator";

export const purchaseRepository = {
  async getAll() {
    return prisma.purchase.findMany({
      include: { 
        supplier: { select: { name: true } }, 
        items: {
          include: {
            product: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.purchase.findUnique({
      where: { id },
      include: { 
        supplier: true, 
        items: {
          include: {
            product: { select: { name: true, sku: true } }
          }
        }
      },
    });
  },

  async createWithStockUpdates(data: PurchaseInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Calculate total amount
      const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);

      // 2. Create Purchase record
      const purchase = await tx.purchase.create({
        data: {
          supplierId: data.supplierId,
          totalAmount,
          referenceNo: data.referenceNo,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              costPrice: item.costPrice,
            }))
          }
        },
        include: { items: true }
      });

      // 3. Process each item (Update Stock & Movements & Last Cost)
      for (const item of purchase.items) {
        // Increment Stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            lastCostPrice: item.costPrice,
            lastPurchasedAt: new Date(),
            preferredSupplierId: data.supplierId // Update preferred supplier automatically
          }
        });

        // Record Movement
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            purchaseId: purchase.id,
            type: MovementType.PURCHASE,
            quantity: item.quantity,
          }
        });
      }

      return purchase;
    });
  },

  async createInitialPurchase(productId: string, sku: string, supplierId: string, quantity: number, costPrice: number, tx?: Prisma.TransactionClient) {
    const db = tx || prisma;
    return db.purchase.create({
      data: {
        supplierId,
        totalAmount: quantity * costPrice,
        referenceNo: `INIT-${sku}`,
        status: "COMPLETED",
        items: {
          create: [{
            productId,
            quantity,
            costPrice
          }]
        }
      }
    });
  }
};
