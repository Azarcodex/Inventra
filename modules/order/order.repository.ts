import { Prisma, PrismaClient, MovementType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

type TxClient = Prisma.TransactionClient | PrismaClient;

export const orderRepository = {
  async getProductsByIds(productIds: string[], tx: TxClient) {
    return tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, stock: true, price: true },
    });
  },

  async decrementStock(productId: string, quantity: number, tx: TxClient) {
    return tx.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });
  },

  async createMovement(productId: string, quantity: number, type: MovementType, tx: TxClient) {
    return tx.stockMovement.create({
      data: {
        productId,
        quantity,
        type,
      },
    });
  },

  // 👇 ADDED THIS NEW FUNCTION
  async createOrderRecord(
    total: number,
    items: { productId: string; quantity: number; price: number }[],
    tx: TxClient,
    idempotencyKey?: string
  ) {
    return tx.order.create({
      data: {
        total,
        idempotencyKey,
        // Prisma can create the parent 'Order' and all nested 'OrderItems' at the same time
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
  },

  async getOrders(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                select: { name: true, sku: true },
              },
            },
          },
        },
      }),
      prisma.order.count(),
    ]);

    return { orders, total };
  },
};
