import { prisma } from "@/lib/db/prisma";
import { CreateOrderInput } from "./order.types";
import { createOrderSchema } from "./order.validator";
import { orderRepository } from "./order.repository";
import { overviewService } from "@/modules/analytics/overview/overview.service";
import { MovementType, Prisma } from "@prisma/client";

export const orderService = {
  async createOrder(input: CreateOrderInput) {
    const validated = createOrderSchema.parse(input);

    if (validated.idempotencyKey) {
      const existingOrder = await prisma.order.findUnique({
        where: { idempotencyKey: validated.idempotencyKey },
      });
      if (existingOrder) {
        return { success: true, orderId: existingOrder.id, total: existingOrder.total };
      }
    }

    const productIds = Array.from(new Set(validated.items.map(item => item.productId)));
    const movementsToProcess: Array<any> = [];

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let total = 0;
      const orderItemsToSave: { productId: string; quantity: number; price: number }[] = [];

      const productsArray = await orderRepository.getProductsByIds(productIds, tx);
      const productMap = new Map(productsArray.map((p) => [p.id, p]));

      // Merge quantities in case there are duplicates in the request payload
      const itemMap = new Map();
      for (const item of validated.items) {
        if (itemMap.has(item.productId)) {
          itemMap.set(item.productId, itemMap.get(item.productId) + item.quantity);
        } else {
          itemMap.set(item.productId, item.quantity);
        }
      }

      for (const [productId, quantity] of itemMap.entries()) {
        const product = productMap.get(productId);

        if (!product) {
          throw new Error(`Product not found: ${productId}`);
        }

        if (product.stock < quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        total += product.price * quantity;

        orderItemsToSave.push({
          productId,
          quantity,
          price: product.price,
        });
      }

      // Parallelize atomic decrement and movement creation to eliminate N+1 latency
      await Promise.all([
        ...orderItemsToSave.map((item) =>
          orderRepository.decrementStock(item.productId, item.quantity, tx)
        ),
        ...orderItemsToSave.map((item) =>
          orderRepository.createMovement(item.productId, item.quantity, MovementType.SALE, tx)
        )
      ]);

      // Collect data for analytics (decoupled from transaction)
      for (const item of orderItemsToSave) {
        movementsToProcess.push({
          productId: item.productId,
          type: MovementType.SALE,
          quantity: item.quantity,
          price: item.price
        });
      }

      // Actually save the receipt!
      const order = await orderRepository.createOrderRecord(total, orderItemsToSave, tx, validated.idempotencyKey);

      return {
        success: true,
        orderId: order.id,
        total,
      };
    });

    // Process analytics decoupled from the main checkout transaction
    await Promise.allSettled(
      movementsToProcess.map((m) =>
        prisma.$transaction(async (tx) => {
          await overviewService.updateFromMovement(m, tx);
        })
      )
    ).catch(console.error);

    return result;
  },

  async getOrders(page: number, limit: number) {
    return orderRepository.getOrders(page, limit);
  },
};
