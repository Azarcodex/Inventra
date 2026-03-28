import { prisma } from "@/lib/db/prisma";
import { MovementType, Prisma } from "@prisma/client";
import { stockRepository } from "@/modules/stock/stock.repository";
import { MESSAGES } from "@/constants/messages";
import { createStockMovementSchema } from "@/modules/stock/stock.validator";
import { calculateStockStatus } from "@/utils/stockStatus";
import { overviewService } from "@/modules/analytics/overview/overview.service";

export const stockService = {
  async createStockMovement(input: {
    productId: string;
    type: MovementType;
    quantity: number;
  }) {
    // ✅ Zod validation (safe)
    const validated = createStockMovementSchema.safeParse(input);

    if (!validated.success) {
      throw new Error(
        validated.error.issues[0]?.message || MESSAGES.INVALID_INPUT,
      );
    }

    const { productId, type, quantity } = validated.data;

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await stockRepository.getProductForUpdate(
        tx,
        productId,
      );

      if (!product) {
        throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
      }

      let newStock = product.stock;

      switch (type) {
        case MovementType.SALE:
          if (product.stock < quantity) {
            throw new Error(MESSAGES.INSUFFICIENT_STOCK);
          }
          newStock = product.stock - quantity;
          break;

        case MovementType.PURCHASE:
          newStock = product.stock + quantity;
          break;

        case MovementType.ADJUSTMENT:
          newStock = product.stock + quantity;
          break;

        default:
          throw new Error(MESSAGES.INVALID_MOVEMENT_TYPE);
      }

      if (newStock < 0) {
        throw new Error(MESSAGES.NEGATIVE_STOCK);
      }

      await stockRepository.updateProductStock(tx, productId, newStock);

      const movement = await stockRepository.createMovement(tx, {
        productId,
        type,
        quantity,
      });

      await overviewService.updateFromMovement(
        {
          productId: movement.productId,
          type: movement.type,
          quantity: movement.quantity,
        },
        tx
      );

      return {
        movement,
        newStock,
      };
    });
  },

  async getMovements(productId: string) {
    if (!productId) throw new Error("Product ID is required");
    return stockRepository.findByProductId(productId);
  },

  async getProductStockStatus(productId: string) {
    if (!productId) {
      throw new Error(MESSAGES.PRODUCT_ID_REQUIRED);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        stock: true,
        bufferStock: true,
      },
    });

    if (!product) {
      throw new Error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    const status = calculateStockStatus(product.stock, product.bufferStock);

    return {
      ...product,
      status,
    };
  },
};
