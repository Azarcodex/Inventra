import { prisma } from "@/lib/db/prisma";
import { CreateOrderInput } from "./order.types";
import { createOrderSchema } from "./order.validator";
import { orderRepository } from "./order.repository";
import { overviewService } from "@/modules/analytics/overview/overview.service";
import { MovementType, Prisma } from "@prisma/client";

export const orderService = {
  async createOrder(input: CreateOrderInput) {
    const validated = createOrderSchema.parse(input);

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let total = 0;

      for (const item of validated.items) {
        const product = await orderRepository.getProductForUpdate(item.productId, tx);

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        const newStock = product.stock - item.quantity;
        await orderRepository.decrementStock(item.productId, newStock, tx);

        const movement = await orderRepository.createMovement(
          item.productId,
          item.quantity,
          MovementType.SALE,
          tx
        );

        await overviewService.updateFromMovement(
          {
            productId: movement.productId,
            type: movement.type,
            quantity: movement.quantity,
            price: product.price,
          },
          tx
        );

        total += product.price * item.quantity;
      }

      return {
        success: true,
        total,
      };
    });
  },
};
