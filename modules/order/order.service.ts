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
      
      // 👇 We'll collect the data here to save the order at the end of the transaction
      const orderItemsToSave = [];

      for (const item of validated.items) {
        const product = await orderRepository.getProductForUpdate(item.productId, tx);

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // Deduct inventory
        const newStock = product.stock - item.quantity;
        await orderRepository.decrementStock(item.productId, newStock, tx);

        // Record movement audit
        const movement = await orderRepository.createMovement(
          item.productId,
          item.quantity,
          MovementType.SALE,
          tx
        );

        // Record dashboard analytics
        await overviewService.updateFromMovement(
          {
            productId: movement.productId,
            type: movement.type,
            quantity: movement.quantity,
            price: product.price,
          },
          tx
        );

        // Calculate running total
        total += product.price * item.quantity;

        // 👇 Push the item details into our array
        orderItemsToSave.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // 👇 Actually save the receipt!
      const order = await orderRepository.createOrderRecord(total, orderItemsToSave, tx);

      return {
        success: true,
        orderId: order.id,
        total,
      };
    }, {
      maxWait: 5000,
      timeout: 15000,
    });
  },

  async getOrders(page: number, limit: number) {
    return orderRepository.getOrders(page, limit);
  },
};
